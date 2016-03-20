var LoLAPI = require('./customCache');
var test = require('tape');

test('LoL Versions', function(t) {
  LoLAPI.request.getLoLVersions({
    realm: 'euw',
  })
  .then((res)=> {
    t.ok(res);
    console.log('Final versions result ' + res[0]);
    t.end();
  });
});
