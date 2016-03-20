var LoLAPI = require('./customCache');
var test = require('tape');

var summoner_id = 'NiP Bjergsen';

test('Summoner ID from Summoner Name', function(t) {
  LoLAPI.request.getSummonerIdFromSummonerName({
    summonerName: summoner_id,
    realm: 'euw'
  })
  .then((res)=> {
    t.ok(res, 'Result present');
    var r = LoLAPI.helper.parseSummonerName(summoner_id);
    t.ok(res[r], 'Correct summoner id as a key');
    t.equal(res[r].name, 'NiP Bjergsen');
    t.equal(res[r].id, 19442683);
    console.log('Final result ' + Object.keys(res));
    t.end();
  });
});
