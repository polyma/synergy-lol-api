#syner.gg LoL API Wrapper

This is a LoL API wrapper written in NodeJS that is designed to be used in distributed calculations. We are using it at syner.gg to make sure that we don't exceed our rate limit whilst using one API key over our cluster computing algorithms and game data crawlers.

That just means it uses a Redis key-value cache to store the request count, nothing fancy.

I wouldn't use this in production yet - at the moment it's very idiosyncratic to the syner.gg backend and as such there are many many features missing. Many of the endpoints are unaccounted for, but feel free to add them yourself and make a pull request to have them added on this repo.


## Features ##

 - Bluebird Promises
 - Distributed caching with Redis so you don't hit your API rate limit using multiple machines

## Installation ##

    npm install synergy-lol-api

## Usage ##
In your nodeJS script call

    var LoLAPI = require('synergy-lol-api').init({
  		cache: cache, //TODO: insert redis cache here
  		api_key: api_key, //TODO: insert api key here
  	    limit_ten_seconds: 10,
  	    limit_one_hour: 500
  	})

Then use as follows:

    LoLAPI.request.getSummonerIdFromSummonerName({
	    realm: 'euw',
	    summonerName: 'NiP Bjergsen'
    }).then(function(result) {
	    console.log(result['nipbjergsen'].id);
    });

##Contributing
We're very happy for people to contribute to this project, nay, we encourage it! If you would like to contribute make a pull request and we'll do our best to review it.

Things to bear in mind:

 1. We don't accept any pull requests without tests. If you write a new feature, it **must** be testable.
 2. Use **Promises not callbacks** (where possible).
 3. This project was initially solely for syner.gg purposes and we only use a handful of endpoints (in our calculations, at least), so you may find it lacking. However, adding an endpoint handler is very very simple. They are stored under /lib/handlers. Just add a new file, naming it according to the method name and copy the url convention used in the other handlers, if you're having any problems then just raise an issue on GitHub.

## Changelog ##
### [1.0.8] - 2016-03-19 ###
#### Added ####

- Changelog!
- creation of 'local' Redis instance if none is passed in.
- helper functions folder - loaded in the same way as the request handlers
- enhanced testing

## Planned features ##

 - Caching request results - This will allow us to save the results of API queries in a distributed cache and call upon them when needed.
 - Redis database switching
 - Advanced error handling
## Known issues ##
**Too many to list here**
