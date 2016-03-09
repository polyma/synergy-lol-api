module.exports = {
  name: 'getMatch',
  handler: function(reqObj) {
    console.log('Initiating request for match data for match id ' + reqObj.matchId);
    var url = this.replaceEndpointVariables(reqObj.realm, reqObj.endpoint);
    url = url + reqObj.matchId  //Already has trailing slash
      + '?includeTimeline=true';
    return this.initRequest(url, null);
  }
}
