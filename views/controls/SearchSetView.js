/* global require: false */
/* global module: false */

var Views = {
  Search: require('./SearchView'),
  ControlSet: require('./ControlSetView')
};

module.exports = Views.ControlSet.extend({

  view: Views.Search

});
