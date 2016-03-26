/*
  CONVERTS ARRAY TO CSV
*/
module.exports = function(input) {
  if(Array.isArray(input)) {
    return input.join(",");
  }
  else if(typeof input === 'string') {
    return input;
  }
  else {
    throw 'Illegal input into joinIfArray function';
  }
}
