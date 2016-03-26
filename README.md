#syner.gg LoL API Wrapper

[![Coverage Status](https://coveralls.io/repos/github/polyma/synergy-lol-api/badge.svg?branch=master)](https://coveralls.io/github/polyma/synergy-lol-api?branch=master)

This is a LoL API wrapper written in NodeJS that is designed to be used in distributed calculations. We are using it at syner.gg to make sure that we don't exceed our rate limit whilst using one API key over our cluster computing algorithms and game data crawlers.

That just means it uses a Redis key-value cache to store the request count, nothing fancy.

I wouldn't use this in production yet - at the moment it's very idiosyncratic to the syner.gg backend and as such there are many many features missing. Many of the endpoints are unaccounted for, but feel free to add them yourself and make a pull request to have them added on this repo.


## Features ##

 - Bluebird Promises
 - Distributed caching with Redis so you don't hit your API rate limit using multiple machines
 - Logging

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

## Logging ##

Logging is supported out of the box, simply pass in your transport like so:

    var winston = require('winston');
    require('winston-loggly');
    winston.add(winston.transports.Loggly, options);
    var LoLAPI = require('synergy-lol-api').init({
      cache: cache, //TODO: insert redis cache here
      logger: winston,
      api_key: api_key, //TODO: insert api key here
      limit_ten_seconds: 10,
      limit_one_hour: 500
    });

##Contributing
We're very happy for people to contribute to this project, nay, we encourage it! If you would like to contribute make a pull request and we'll do our best to review it.

Things to bear in mind:

 1. We don't accept any pull requests without tests. If you write a new feature, it **must be testable**.
 2. Use **Promises not callbacks** (where possible).
 3. This project was initially solely for syner.gg purposes and we only use a handful of endpoints (in our calculations, at least), so you may find it lacking. However, **adding an endpoint handler is very very simple**. They are stored under /lib/handlers. Just add a new file, naming it according to the method name and copy the url convention used in the other handlers, if you're having any problems then just raise an issue on GitHub.

## Design Decisions ##
- The endpoint handlers are split up into two sections - route stems and handlers. The route stems provide the, um, 'stem' for the endpoint like '/summoner' and then the handlers are 'actions' which you can perform on each endpoint. The result is requests that are human readable like 'LoLAPI.request.getSummonerIdFromSummonerName()' or 'LoLAPI.getLoLVersions()'. I guess we could have had a system where the requests were formatted like the RiotAPI - 'LoLAPI.request.summoner.byName' or something like that, but I don't much like having to go back to the RiotAPI every five minutes just to find out how exactly each one of those endpoints is ordered. Also, each one of those endpoints ends up being quite distinct in its parameters such that thinking the endpoints consistent is quite a folly. e.g. /summoner/{summonerIds} and /summoner/by-name/{summonerNames} take different format inputs and therefore require different input parsing.

## Changelog ##
### [1.0.11] - 2016-03-25 ###
#### Fixed ####
- Ranked Queues were not being processed correctly in the Match List handler.
- Fail count exception handler fixed.

#### Added ####

- route builder system.
- filter select variables by using 'returnVars' as an argument to the request object.
- shutdown method.

#### Changed ####
- getMatchList now accepts 'rankedQueue' as well as the plural, 'rankedQueues'.

### [1.0.10] - 2016-03-25 ###
#### Added ####

- support for input as 'realm' or 'region', they are now interchangeable.
- witholds queue execution if cache server is disconnected.
- added output of how many requests are left in the hour (useful for developing crawlers).
- much better results handling for 404 errors and address not found errors.

### [1.0.9] - 2016-03-23 ###
#### Added ####

- Coveralls.io support

### [1.0.8] - 2016-03-19 ###
#### Added ####

- Changelog!
- creation of 'local' Redis instance if none is passed in.
- helper functions folder - loaded in the same way as the request handlers.
- improved testing suite.

## Planned features ##

 - Caching request results - This will allow us to save the results of API queries in a distributed cache and call upon them when needed.
 - Redis database switching.
 - Advanced error handling.

## Known issues ##
**Too many to list here**


## API Documentation ##
### Realm or Region ###
We honestly have no clue what is better 'realm' or 'region', so we've added in support for both, they are interchangeable throughout the module.

### Filter Return Variables ###
You can filter down your return variables like so:

    LoLAPI.request.getSummonerIdFromSummonerName({
      realm: 'euw',
      summonerName: 'NiP Bjergsen',
      returnVars: 'nipbjergsen' // Can be string or array of requested return variables
    }).then(function(result) {
      console.log(result);
      /*
      Outputs (at time of writing):
        { id: 19442683,
        name: 'NiP Bjergsen',
        profileIconId: 558,
        summonerLevel: 30,
        revisionDate: 1383327484000 }
      */
    });


This may help with reducing your memory footprint.

### Supported Actions ###
These are the supported League of Legends API actions:
- LoLAPI.request.getLoLVersions()
- LoLAPI.request.getMatchList()
- LoLAPI.request.getMatch()
- LoLAPI.request.getSummonerIdFromSummonerName()
- LoLAPI.request.getTeam()
