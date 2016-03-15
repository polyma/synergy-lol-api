module.exports = {
  name: 'getLoLVersions',
  handler: function(reqObj) {
    console.log('Getting LoL Game Versions');
    if(typeof reqObj.endpoint === 'undefined') {
      var endpoint = 'https://global.api.pvp.net/api/lol/static-data/$r/v1.2/versions/';
    }
    else {
      var endpoint = reqObj.endpoint;
    }
    var url = this.replaceEndpointVariables(reqObj.realm, endpoint);
    url = url  //Already has trailing slash
      + '?';
    return this.initRequest(url, null);
  },
  defaultEndpoint: 'https://global.api.pvp.net/api/lol/static-data/$r/v1.2/versions/'
}
