/* global require: false */
/* global module: false */

var Views = {
  Date: require('./DateView'),
  ControlSet: require('./ControlSetView')
};

module.exports = Views.ControlSet.extend({

  view: Views.Date

});
