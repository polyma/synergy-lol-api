if(!process.env.LOL_API_KEY) {
  require('dotenv').config({path: '../.env'});
}

var test = require('tape');

//Mock init obj
var LoLAPI = require('../index')
  .init({
    cacheServer: '192.168.10.10',
    api_key: process.env.LOL_API_KEY,
    limit_ten_seconds: process.env.LOL_RATE_LIMIT_10S,
    limit_one_hour: process.env.LOL_RATE_LIMIT_HOUR
  });

test('inbuilt cache', function(t) {
  t.notEqual(typeof LoLAPI.cache, 'undefined');
  t.equal(LoLAPI.cache.connected, true);
  clearInterval(LoLAPI.queueInterval);
  t.end();
});

module.exports = LoLAPI;
