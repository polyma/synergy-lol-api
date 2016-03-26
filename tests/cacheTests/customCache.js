if(!process.env.LOL_API_KEY) {
  require('dotenv').config({path: '../.env'});
}
var test = require('tape');

var Promise = require('bluebird');

var redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
var cache = redis.createClient('redis://' + process.env.CACHE_SERVER + ':' + process.env.CACHE_PORT);
var LoLAPI = require('../index');
cache.on('connect', function() {
  console.log('Connected to Redis');
}.bind(this));
//Mock init obj
LoLAPI.init({
  cache: cache,
  api_key: process.env.LOL_API_KEY,
  limit_ten_seconds: process.env.LOL_RATE_LIMIT_10S,
  limit_one_hour: process.env.LOL_RATE_LIMIT_HOUR
});

test('Custom Cache', function(t) {
  t.equals(LoLAPI.cache.connected, true);
  LoLAPI.shutdown();
  t.end();
});



module.exports = LoLAPI;
