var LoLAPI = require('./obj/testCache.js');
var test = require('tape');

var summoner_id = 'h10hfueh0hhf!1f38hf03uh!';

test('Address not found error', function(t) {
  LoLAPI.request.getSummonerIdFromSummonerName({
    summonerName: summoner_id,
    realm: 'eu'
  })
  .then((res)=> {
    t.end();
  });
});
