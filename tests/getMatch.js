var LoLAPI = require('./obj/testCache.js');
var Promise = require('bluebird');
var test = require('tape');
test('Get single match', function(t) {
  Promise.all([
    LoLAPI.request.getMatch({
      matchId: '2510752338',
      realm: 'euw',
      includeTimeline: false
    })
    .then((res)=> {
      t.ok(res, 'First request returned');
      console.log('Final result 1: ' + Object.keys(res));
      t.notOk(res.timeline, 'Timeline not present')
    }),
    LoLAPI.request.getMatch({
      matchId: '2510752338',
      realm: 'euw',
      includeTimeline: true
    })
    .then((res)=> {
      t.ok(res, 'Second request returned');

      console.log('Final result 2: ' + Object.keys(res));
      t.ok(res.timeline, 'Timeline present')

    }),
    LoLAPI.request.getMatch({
      matchId: '2510752338',
      realm: 'euw',
    })
    .then((res)=> {
      t.ok(res, 'Third request returned');

      t.notOk(res.timeline, 'Timeline not present')
      console.log('Final result 3: ' + Object.keys(res));
    }),
  ]).then(()=> {
    t.end();
  });
});
