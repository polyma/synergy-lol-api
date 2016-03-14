module.exports = {
  name: 'getSummonerIdFromSummonerName',
  handler: function(reqObj) {
    if(typeof reqObj.endpoint === 'undefined') {
      var endpoint = 'https://$r.api.pvp.net/api/lol/$r/v1.4/summoner/by-name/';
    }
    else {
      var endpoint = reqObj.endpoint;
    }
    var url = this.replaceEndpointVariables(reqObj.realm, endpoint);
    url = url
      + reqObj.summonerName//Already has trailing slash
      + '?'
    return this.initRequest(url, null);
  },
  defaultEndpoint: 'https://$r.api.pvp.net/api/lol/$r/v1.4/summoner/by-name/'
}
