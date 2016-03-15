##Syner.gg LoL API Wrapper

This is a LoL API wrapper written in NodeJS that is designed to be used in distributed calculations. We are using it at Syner.gg to make sure that we don't exceed our rate limit while using our cluster computing algorithms.

That just means it uses a distributed Redis cache, nothing fancy.

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
 3. Adding an endpoint handler is very very simple. They are stored under /lib/handlers. Just add a new file, naming it according to the method name and copy the convention used in the other handlers.

## Planned features ##

 - Caching results - This will allow us to save the results of API queries in a distributed cache and call upon them when needed.
 - Redis database switching

## Known issues ##
**Too many to list here**
