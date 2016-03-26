module.exports = {
  name: 'getSummonerIdFromSummonerName',
  handler: function(reqObj) {
    if(typeof reqObj.endpoint === 'undefined') {
      var endpoint = this.routeStem.summoner() + '/by-name/';
    }
    else {
      var endpoint = reqObj.endpoint;
    }
    var url = this.replaceEndpointVariables((reqObj.realm || reqObj.region), endpoint);
    url = url
      + reqObj.summonerName//Already has trailing slash
      + '?'
    return this.initRequest(url, (reqObj.returnVars || null));
  },
}
