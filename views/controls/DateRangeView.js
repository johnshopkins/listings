/* global require: false */
/* global module: false */
/* global dataLayer: false */

var $ = require('../../shims/jquery');
var Backbone = require('../../shims/backbone');

var Views = {
  Control: require('./ControlView')
};

module.exports = Views.Control.extend({

  events: {
    'change > input': 'onChange'
  },

  initialize: function (options) {

    Views.Control.prototype.initialize.call(this, options);

    var self = this;
    this.listenTo(this.state, 'state:reset', function () {
      console.log('need to clear date range filter');
      // self.$el.removeClass('active');
    });

  },

  onChange: function (e) {

    var target = $(e.target);
    var filter = target.val();

    if (filter) {
      this.trigger('filter:activate:add', filter);
      this.activeFilter = filter;
      console.log('activate date range: ' + this.activeFilter);
    } else if (this.activeFilte) {
      console.log('deactivate date range: ' + this.activeFilter);
      this.trigger('filter:deactivate', this.activeFilter);
      this.activeFilter = null;
    }

  }

});
