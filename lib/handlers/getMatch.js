module.exports = {
  name: 'getMatch',
  handler: function(reqObj) {
    console.log('Initiating request for match data for match id ' + reqObj.matchId);
    if(typeof reqObj.endpoint === 'undefined') {
      var endpoint = this.routeStem.match() + '/';
    }
    else {
      var endpoint = reqObj.endpoint;
    }

    var url = this.replaceEndpointVariables((reqObj.realm || reqObj.region), endpoint);
    url = url + reqObj.matchId  //Already has trailing slash
      + '?'
      + (function() {
        if(reqObj.includeTimeline) {
          return '&includeTimeline=true';
        }
        else {
          return '';
        }
        })()
    return this.initRequest(url, null);
  }
}
