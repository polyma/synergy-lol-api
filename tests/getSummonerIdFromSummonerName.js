var LoLAPI = require('./');

LoLAPI.request.getSummonerIdFromSummonerName({
  summonerName: 'mcdilly',
  realm: 'euw'
})
.then((res)=> {
  console.log('Final result ' + Object.keys(res));
});
