var LoLAPI = require('./customCache');
var test = require('tape');

var summoner_id = 'h10hfueh0hhf!1f38hf03uh!';

test('404 from summoner name finding', function(t) {
  LoLAPI.request.getSummonerIdFromSummonerName({
    summonerName: summoner_id,
    realm: 'euw'
  })
  .then((res)=> {
    t.notOk(res, 'No results received');
    t.end();
  });
});
