/* global require: false */
/* global module: false */

var $ = require('../../shims/jquery');
var Backbone = require('../../shims/backbone');

var Views = {
  DateRange: require('./DateRangeView'),
  ControlSet: require('./ControlSetView')
};

module.exports = Views.ControlSet.extend({

  view: Views.DateRange

});
