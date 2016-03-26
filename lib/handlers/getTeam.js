module.exports = {
  name: 'getTeam',
  handler: function(reqObj) {
    console.log('Getting team data for team id ' + reqObj.team_id);
    if(typeof reqObj.endpoint === 'undefined') {
      var endpoint = this.routeStem.team() + '/';
    }
    else {
      var endpoint = reqObj.endpoint;
    }
    var url = this.replaceEndpointVariables((reqObj.realm || reqObj.region), endpoint);
    url = url + reqObj.team_id  //Already has trailing slash
      + '?';
    return this.initRequest(url, null);
  }
}
