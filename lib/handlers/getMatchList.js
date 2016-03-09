module.exports = {
  name: 'getMatchList',
  handler: function(reqObj) {
    console.log('Getting match list for ' + reqObj.summonerId);
    var url = this.replaceEndpointVariables(reqObj.realm, reqObj.endpoint);
    //Convert JSON array to csv
    var queues = reqObj.rankedQueues.join(",");
    var seasons = reqObj.seasons.join(',');
    url = url + reqObj.summonerId  //Already has trailing slash
      + '?rankedQueues=' + queues
      + "&seasons=" + seasons
      + (function() {
        if(reqObj.beginTime)
          return '&beginTime=' + reqObj.beginTime;
        else return "";
      })()
      + (function() {
        if(reqObj.endTime)
          return '&endTime=' + reqObj.endTime;
        else return "";
      })();
    return this.initRequest(url, null); //promise
  }
}
