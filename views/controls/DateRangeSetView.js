/* global require: false */
/* global module: false */

var Views = {
  DateRange: require('./DateRangeView'),
  ControlSet: require('./ControlSetView')
};

module.exports = Views.ControlSet.extend({

  view: Views.DateRange

});
