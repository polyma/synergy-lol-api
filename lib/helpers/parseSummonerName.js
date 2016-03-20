/*
  CONVERTS NUDE SUMMONER NAME TO A URL-ENCODED VERSION
*/
module.exports = function(summoner_name) {
  return encodeURI(summoner_name.replace(/\s/g, '').toLowerCase());
}
