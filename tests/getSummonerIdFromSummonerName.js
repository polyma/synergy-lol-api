var LoLAPI = require('./');

LoLAPI.request.getSummonerIdFromSummonerName({
  summonerName: 'NiP Bjergsen',
  realm: 'euw'
})
.then((res)=> {
  console.log('Final result ' + Object.keys(res));
});
