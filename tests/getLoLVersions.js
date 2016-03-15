var LoLAPI = require('./');

LoLAPI.request.getLoLVersions({
  realm: 'euw',
})
.then((res)=> {
  console.log('Final result ' + res[0]);
});
