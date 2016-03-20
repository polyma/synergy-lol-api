//Get the process vars
// require('dotenv').config({path: '../.env'});
require('dotenv').config();



// Run all the tests in the directory
require('fs').readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var r = require('./' + file);
  }
});
