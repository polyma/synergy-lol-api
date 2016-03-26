module.exports = {
  name: 'getLoLVersions',
  handler: function(reqObj) {
    console.log('Getting LoL Game Versions');
    if(typeof reqObj.endpoint === 'undefined') {
      var endpoint = this.routeStem.static() + '/versions/';
    }
    else {
      var endpoint = reqObj.endpoint;
    }
    var url = this.replaceEndpointVariables((reqObj.realm || reqObj.region), endpoint);
    url = url  //Already has trailing slash
      + '?';
    return this.initRequest(url, null);
  },
}
