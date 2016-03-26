var async = require('async');
var rp = require('request-promise');
var Promise = require('bluebird');

/*
  LoL API object that deals with everything.
*/
var LoLAPI = {
  init: function(inputObj) {
    /*
    SET UP LOGGER
    */
    if(typeof inputObj.logger !== 'undefined') {
      this.logger = inputObj.logger;
    }
    else {
      this.logger = console;
    }
    /*
    END SET UP LOGGER
    */

    /*
    SET UP ERROR HANDLER
    */
    if(typeof inputObj.errorHandler !== 'undefined') {
      this.errorHandler = inputObj.errorHandler;
    }
    else {
      this.errorHandler = this.logger.error;
    }
    /*
    END ERROR HANDLER
    */

    /*
      SET UP CACHE TODO: replace with CHECK that global redis exists
    */
    if(!inputObj.cache) {
      var redis = require('redis');
      Promise.promisifyAll(redis.RedisClient.prototype);
      Promise.promisifyAll(redis.Multi.prototype);
      this.cache = redis.createClient('redis://' + inputObj.cacheServer + ':' + (inputObj.cachePort || '6379'));
    }
    else {
      this.cache = inputObj.cache;
      this.cache.on("error", function (err) {
        this.errorHandle(err);
      }.bind(this));
    }
    this.cache.on('connect', function() {
      this.logger.log('LoL API Connected to Redis');
      this.getOneHourCount().then(count => {
        this.logger.log(inputObj.limit_one_hour - count + ' API requests available in the hour.');
        return this.timeToHourExpiry();
      })
      .then(ttl => {
        this.logger.log(ttl + ' seconds left until hour cache expiry');
      });
    }.bind(this));
    /*
      END CACHE SETUP
    */


    this.setApiKey(inputObj.api_key);
    this.failCount = inputObj.fail_count || 5;
    //Load all the handlers in the handlers dir.
    require('fs').readdirSync(__dirname + '/lib/handlers').forEach(function(file) {
      if (file.match(/\.js$/) !== null && file !== 'index.js') {
        var r = require('./lib/handlers/' + file);
        this.request[r.name] = r.handler.bind(this);
      }
    }.bind(this));
    //Load all the helpers in the helpers dir.
    this.helper = {};
    require('fs').readdirSync(__dirname + '/lib/helpers').forEach(function(file) {
      if (file.match(/\.js$/) !== null && file !== 'index.js') {
        var r = require('./lib/helpers/' + file);
        this.helper[file.replace(/\.js$/, '')] = r;
      }
    }.bind(this));

    //Load all the route builders in the route builders dir.
    this.routeStem = {};
    require('fs').readdirSync(__dirname + '/lib/route-stem').forEach(function(file) {
      if (file.match(/\.js$/) !== null && file !== 'index.js') {
        var r = require('./lib/route-stem/' + file);
        this.routeStem[file.replace(/\.js$/, '')] = r;
      }
    }.bind(this));

    //TODO: do we definitely want -1?
    this.setRateLimit(inputObj.limit_ten_seconds-1, inputObj.limit_one_hour);
    //Set the timeouts for the queue master
    this.beginQueueInterval();
    return this;
  },
  beginQueueInterval: function() {
    this.queueInterval = setInterval(function() {
      return this.checkRateLimit()
        .then((spaces)=> {
          if(spaces && (this.queue.length > 0)) {
            return this.execQueue(spaces);
          }
          else {
            return;
          }
        }).bind(this);
    }.bind(this), 10);
    this.logger.log('Created LoL API Request Handler');
    return;
  },
  setApiKey: function(key) {
    return this.apiKey = key;
  },
  timeToHourExpiry: function() {
    return this.cache.ttlAsync('lolapi_onehour');
  },
  refreshCache: function() {
    return this.cache.delAsync('lolapi_tenseconds', 'lolapi_onehour');
  },
  incrementTenSecondsCount: function() {
    //If not set then set
    return this.cache.multi().incr('lolapi_tenseconds').expire('lolapi_tenseconds', 11).execAsync()
    .then((value)=> {
      if(!value) {
        return this.logger("Couldn't set the 10 second rate key");
      }
      return value;
    }).bind(this);
  },
  incrementOneHourCount: function() {
    //If not set then set
    return this.cache.multi().incr('lolapi_onehour').expire('lolapi_onehour', 3601).execAsync()
    .then((value)=> {
      if(!value) {
        return this.logger("Couldn't set one hour key.");
      }
      return value;
    }).bind(this);
  },
  getTenSecondsCount: function() {
    return this.cache.getAsync('lolapi_tenseconds')
      .then((key)=> {
        if(key) {
          return key;
        }
        else {
          return 0;
        }
      });
  },
  getOneHourCount: function() {
    return this.cache.getAsync('lolapi_onehour')
    .then((key)=> {
      if(key) {
        return key;
      }
      else {
        return 0;
      }
    });

  },
  rateLimit: {
    tenSeconds: null,
    oneHour: null,
  },
  requestCount: {
    tenSeconds: 0,
    oneHour: 0,
    outstandingRequests: 0
  },
  failCount: 5,
  setRateLimit: function(ten_seconds, one_hour) {
    this.rateLimit.tenSeconds = ten_seconds;
    this.rateLimit.oneHour = one_hour;
  },
  // If a 429 is discovered then it sends a retry-after seconds count, test if it greater than remaining time
  retryRateLimitOverride: function(retry_after) {
    //TODO: do I need to parse int here?
    var r = parseInt(retry_after) * 1000;
    //Always clear the 10s timeout just to be certain.
    //Clear interval and reset after retry after is cleared
    clearInterval(this.tenSecondsTimeout);
    this.logger.log(this.tenSecondsTimeout);
  },
  checkRateLimit: function() {
    return this.getOneHourCount() //Get this first because we care about it less
      .then((oneHour)=> {
        return this.getTenSecondsCount()
        .then((tenSeconds)=> { //NESTED SO WE CAN ACCESS UPPER VARS IN SCOPE
          //TODO: there is a wierd type error here........ for some reason it outputs number for tenseconds and a string for hour
          if((parseInt(tenSeconds) + this.requestCount.outstandingRequests) >= this.rateLimit.tenSeconds) {
            return 0;
          }
          else if((parseInt(oneHour) + this.requestCount.outstandingRequests) >= this.rateLimit.oneHour) {
            return this.timeToHourExpiry()
            .then(ttl => {
              this.logger.log('Hit hour limit: ' + oneHour + '. ' + ttl + ' seconds to go until cache reset.');
              return 0; // 0 Spaces
            })
          }
          else {
            //return the smaller of the requests available
            var requests_left_hour = this.rateLimit.oneHour - parseInt(oneHour) - this.requestCount.outstandingRequests;
            var requests_left_ten_seconds = this.rateLimit.tenSeconds - parseInt(tenSeconds) - this.requestCount.outstandingRequests;
            //As we dont' need to worry about race conditions we don't have to recheck if positive
            if(requests_left_hour > requests_left_ten_seconds) {
              if(requests_left_ten_seconds > 0) {
                return requests_left_ten_seconds;
              }
              else {
                return 0;
              }
            }
            else {
              if(requests_left_hour > 0) {
                return requests_left_hour;
              }
              else {
                return 0;
              }
            }
          }
        });
      });

  },
  initRequest: function(endpoint, returnVars) {
    //Add the request and set up as a promise
    var cb = function(endpoint, returnVars, times_failed) {
      return this.incrementOneHourCount()
        .then((oneHour)=> {
          return this.incrementTenSecondsCount()
            .then((tenSeconds)=> {
              this.requestCount.outstandingRequests += 1;
              var options = {
                uri: encodeURI(endpoint + '&api_key=' + this.apiKey), //Assume the ? has already been added by our endpoint
                json: true,
                resolveWithFullResponse: true
              }
              this.logger.log('Using ' + options.uri);
              this.logger.log(this.requestCount.outstandingRequests);
              this.logger.log(tenSeconds + ' ' + oneHour);
              return rp(options)
              .then(
                function(response) {
                  this.requestCount.outstandingRequests -= 1;
                  if(returnVars) {
                    if(typeof returnVars === 'string') {
                      if(response.body[returnVars]) {
                        return response.body[returnVars]; //Resolve promise
                      }
                      else {
                        this.infoHandle("Couldn't locate the requested returnVar " + returnVars + '. Returning full response.');
                      }
                    }
                    else {
                      var tmp = {};
                      returnVars.forEach(function(item, i) {
                        if(response[item]) {
                          tmp[item] = response.body[item];
                        }
                        else {
                          var bFailedReturnVar = true;
                        }
                      }.bind(this));
                      if(!bFailedReturnVar) {
                        return tmp;  //Resolve promise
                      }
                      else {
                        this.infoHandle("Couldn't locate the requested returnVar " + item + '. Returning full response.');
                        return response.body; //Resolve Promise
                      }
                    }
                  }
                  else {
                    this.logger.log('SUCCESSFUL RESPONSE FROM: ' + endpoint);
                    return response.body; //Resolve promise
                  }
                }.bind(this),
                //REJECTION
                function(reason) {
                  this.requestCount.outstandingRequests -= 1;
                  if(reason.statusCode === 429) {
                    this.logger.log('Rate limit reached!')
                    //NOTE: Riot have been known to remove the header so including this to avoid breaking.
                    if(typeof reason.response['headers']['retry-after'] !== 'undefined') {
                      this.logger.log('Retrying after ' + reason.response['headers']['retry-after'] + 's');
                      // this.retryRateLimitOverride(reason.response['headers']['retry-after']);
                    }
                    else {
                      this.logger.log('No Retry-After header');
                      this.logger.log(reason.response['headers']);
                    }
                  }
                  if(reason.error.code == 'ENOTFOUND') {
                    throw 'Request ' + endpoint + ' did not access a valid endpoint, please check the parameter structure of your request realm and/or platform names. NOT adding back to queue.';
                  }
                  if(reason.statusCode === 404) {
                    //404 isn't an error per se, so we don't throw this.
                    return this.notFoundHandle('Request ' + endpoint + ' REJECTED with reason: ' + reason + '. NOT adding back to queue');
                  }
                  if(typeof times_failed !== 'number') {
                    times_failed = 1;
                  }
                  else {
                    times_failed++;
                  }
                  this.infoHandle('Request ' + endpoint + ' REJECTED with reason: ' + reason + '. Adding back to queue. Failed ' + times_failed + ' times.');
                  return this.addToQueue(cb.bind(this, endpoint, returnVars, times_failed), times_failed, endpoint);
                }.bind(this))
                .catch(err => {
                  return this.errorHandle(err);
                });
            }); //NOTE: I'm not sure why we can't bind here but if we do it causes times_failed to not increment
        });
    }
    return this.addToQueue(cb.bind(this, endpoint, returnVars), 0, endpoint);
  },
  infoHandle: function(str) {
    return this.logger.info(str);
  },
  notFoundHandle: function(str) {
    return this.logger.info(str);
  },
  addToQueue: function(fn, times_failed, endpoint) {
    if(times_failed >= this.failCount) {
      this.infoHandle('Request from endpoint "' + endpoint + '" exceeded fail count!');
      throw 'Request from endpoint "' + endpoint + '" exceeded fail count!';
    }
    else {
      //Turns function to deferred promise and adds to queue.
      this.logger.log('Adding ' + endpoint + ' to queue.');
      var resolve, reject;
      var promise = new Promise(function(reso, reje) {
        resolve = reso;
        reject = reje;
      })
      .then(function(times_failed) {
        this.logger.log('Executing queue item!');
        return fn(); //NOTE: fn is prebound with arguments
      }.bind(this));
      this.queue.push({
        resolve: resolve,
        reject: reject,
        promise: promise
      });
      return promise;
    }
  },
  execQueue: function(end_index) {
    while(this.queue.length > 0 && end_index > 0 && this.cache.connected === true) {
      bUnloaded = true;
      var w = this.queue.shift();
      w.resolve();
      end_index--;
    }
    if(this.cache.connected === false) {
      this.logger.errorHandle('Attempted to execute queue but cache disconnected');
    }
    if(bUnloaded) {
      this.logger.log(this.queue.length + ' in queue after unloading.');
    }
    return;
  },
  queue: [],
  request: {}, //contains all the handlers. Created in the INIT function above.
  helper: {}, // All the helpers
  replaceEndpointVariables: function(realm, endpoint, platform) { //Replaces $r and $p with platform and realm
    //Realm matches $r
    endpoint = endpoint.replace(/\$r/g, realm);
    if(platform) {
      endpoint = endpoint.replace(/\$p/g, platform);
    }
    return endpoint;
  },
  errorHandle: function(str) {
    return this.errorHandler(str);
  },
  shutdown: function(now) {
    return new Promise((resolve, reject) => {
      this.logger.log('LoL API shutting down...');
      clearInterval(this.queueInterval);
      if(now) {
        this.cache.end(true);
      }
      else {
        this.cache.quit();
      }
      this.cache.on('end', function() {
        this.logger.log('Redis connected severed.');
        resolve(true);
      }.bind(this));
    }).bind(this)
  }
}

module.exports = LoLAPI;
