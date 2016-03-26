module.exports = {
  name: 'getMatchList',
  handler: function(reqObj) {
    console.log('Getting match list for ' + reqObj.summonerId);
    if(typeof reqObj.endpoint === 'undefined') {
      var endpoint = this.routeStem.matchList() + '/';
    }
    else {
      var endpoint = reqObj.endpoint;
    }
    var url = this.replaceEndpointVariables((reqObj.realm || reqObj.region), endpoint);
    //Convert JSON array to csv
    if(typeof reqObj.rankedQueue !== 'undefined') {
      var queues = this.helper.joinIfArray(reqObj.rankedQueue);
    }
    else if(typeof reqObj.rankedQueues !== 'undefined') {
      var queues = this.helper.joinIfArray(reqObj.rankedQueues);
    }
    else {
      var queues = ''
    }
    if(typeof reqObj.seasons !== 'undefined') {
      var seasons = reqObj.seasons.join(',');
    }
    else if(typeof reqObj.season !== 'undefined') {
      var seasons = reqObj.season.join(',');
    }
    else {
      var seasons = '';
    }
    url = url + reqObj.summonerId  //Already has trailing slash
      + '?rankedQueues=' + queues
      + "&seasons=" + seasons
      + (function() {
        if(typeof reqObj.beginTime !== 'undefined')
          return '&beginTime=' + reqObj.beginTime;
        else return "";
      })()
      + (function() {
        if(typeof reqObj.endTime !== 'undefined')
          return '&endTime=' + reqObj.endTime;
        else return "";
      })()
      + (function() {
        if(typeof reqObj.beginIndex !== 'undefined')
          return '&beginIndex=' + reqObj.beginIndex;
        else return "";
      })()
      + (function() {
        if(typeof reqObj.endIndex !== 'undefined')
          return '&endIndex=' + reqObj.endIndex;
        else return "";
      })();
    return this.initRequest(url, null); //promise
  }
}
