//Get the process vars
// require('dotenv').config({path: '../.env'});
require('dotenv').config();

var test = require('tape');

// Run all the tests in the directory
require('fs').readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var r = require('./' + file);
  }
});
test('dummy', function(t) {
  t.equals(1, 1);
  t.end();
  process.exit(1);
});
