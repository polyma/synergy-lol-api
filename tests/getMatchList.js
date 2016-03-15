var LoLAPI = require('./');

LoLAPI.request.getMatchList({
  summonerId: '21505497',
  realm: 'euw',
  beginIndex: 0,
  endIndex: 1,
})
.then((res)=> {
  console.log('Final result ' + Object.keys(res));
});
