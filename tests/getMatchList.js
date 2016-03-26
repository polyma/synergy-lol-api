var LoLAPI = require('./obj/testCache.js');
var test = require('tape');
var Promise = require('bluebird');


test('Match List', function(t) {
  Promise.all([
    LoLAPI.request.getMatchList({
      summonerId: '21505497',
      realm: 'euw',
      beginIndex: 0,
      endIndex: 1,
    })
    .then((res)=> {
      t.equal(res.matches.length, 1);
      console.log('Match ID: ' + res.matches[0].matchId);
    }),
    LoLAPI.request.getMatchList({
      summonerId: '21505497',
      realm: 'euw',
      rankedQueue: 'RANKED_SOLO_5x5',
      beginIndex: 0,
      endIndex: 1,
    })
    .then((res)=> {
      console.log('Final result ' + Object.keys(res));
      t.equal(res.matches.length, 1);
      t.equal(res.matches[0].queue, 'RANKED_SOLO_5x5');
      console.log('Match ID: ' + res.matches[0].matchId);
    }),
  ])
  .then(()=> {
    t.end();
  });
});
