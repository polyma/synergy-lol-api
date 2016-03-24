var LoLAPI = require('./customCache');
var test = require('tape');
var Promise = require('bluebird');

var team_id = 'TEAM-e2916ca0-2d5c-11e4-93f6-c81f66db8bc5';

test('Match List', function(t) {
  Promise.all([
    LoLAPI.request.getTeam({
      team_id: team_id,
      realm: 'euw',
    })
    .then((res)=> {
      t.equals(Object.keys(res)[0], team_id);
      return;
    }),
  ])
  .then(()=> {
    t.end();
  });
});
