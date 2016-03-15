var LoLAPI = require('./');

LoLAPI.request.getMatch({
  matchId: '2510752338',
  realm: 'euw',
  includeTimeline: false
})
.then((res)=> {
  console.log('Final result 1: ' + Object.keys(res));
});
LoLAPI.request.getMatch({
  matchId: '2510752338',
  realm: 'euw',
  includeTimeline: true
})
.then((res)=> {
  console.log('Final result 2: ' + Object.keys(res));
});
LoLAPI.request.getMatch({
  matchId: '2510752338',
  realm: 'euw',
})
.then((res)=> {
  console.log('Final result 3: ' + Object.keys(res));
});
