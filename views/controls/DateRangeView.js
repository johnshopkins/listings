/* global require: false */
/* global module: false */
/* global dataLayer: false */

var $ = require('../../shims/jquery');
require('../../lib/jquery.rangepicker.js');

var Views = {
  Control: require('./ControlView')
};

module.exports = Views.Control.extend({

  events: {
    'change > input': 'onChange',
    'click .clear': 'deactivate'
  },

  initialize: function (options) {

    Views.Control.prototype.initialize.call(this, options);

    this.$el.find('input').rangepicker();

    this.listenTo(this.state, 'state:reset', this.deactivateFilter.bind(this));

  },

  deactivateFilter: function () {

    this.state.remove(this.group, this.activeFilter);
    this.$el.find('input').val('');
    this.$el.removeClass('active');
    this.activeFilter = null;

  },

  onChange: function (e) {

    var target = $(e.target);
    var filter = target.val()
      .replace(/\s*-\s*/g, ',')
      .replace(/\//g, '-');

    if (filter) {
      this.state.replace(this.group, filter);
      this.activeFilter = filter;
      this.$el.addClass('active');
    } else if (this.activeFilter) {
      this.deactivateFilter();
    }

  }

});
