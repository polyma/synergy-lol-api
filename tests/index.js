//Get the process vars
// require('dotenv').config({path: '../.env'});
require('dotenv').config();
// require('leaked-handles');
var test = require('tape');

// Run all the tests in the directory
require('fs').readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var r = require('./' + file);
  }
});
test('shutdown', function(t) {
  //Close API
  t.plan(1);
  var LoLAPI = require('./obj/testCache.js');
  LoLAPI.shutdown()
  .then(shutdown_result => {
    t.equals(shutdown_result, true);
    t.end();
    // process.exit(1);
  });
});

//Now run the cache tests
