module.exports = {
  name: 'getTeam',
  handler: function(reqObj) {
    console.log('Getting team data for team id ' + reqObj.team_id);
    var url = this.replaceEndpointVariables(reqObj.realm, reqObj.endpoint);
    url = url + reqObj.team_id  //Already has trailing slash
      + '?';
    return this.initRequest(url, null);
  }
}
