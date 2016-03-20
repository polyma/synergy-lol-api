var LoLAPI = require('./customCache');
var test = require('tape');

test('Match List', function(t) {
  LoLAPI.request.getMatchList({
    summonerId: '21505497',
    realm: 'euw',
    beginIndex: 0,
    endIndex: 1,
  })
  .then((res)=> {
    console.log('Final result ' + Object.keys(res));
    t.equal(res.matches.length, 1);
    console.log('Match ID: ' + res.matches[0].matchId);
    t.end();
  });
});
