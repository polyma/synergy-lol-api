var test = require('tape');
require('dotenv').config();
//Mock init obj
var LoLAPI = require('../index')
  .init({
    cache: null,
    api_key: process.env.LOL_API_KEY,
    limit_ten_seconds: process.env.LOL_RATE_LIMIT_10S,
    limit_one_hour: process.env.LOL_RATE_LIMIT_HOUR
  });
