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

    this.listenTo(this.state, 'state:filter:replace:' + this.group + ':' + this.activeFilter, this.activateFilter);
    this.listenTo(this.state, 'state:filter:remove:' + this.group, this.deactivateFilter);

    this.$el.find('input').rangepicker();

  },

  onChange: function (e) {

    var target = $(e.target);
    var filter = target.val()
      .replace(/\s*-\s*/g, ',')
      .replace(/\//g, '-');

    if (filter) {
      this.activeFilter = filter;
      this.state.replace(this.group, filter);
    } else if (this.activeFilter) {
      this.deactivateFilter();
    }

  },

  activateFilter() {

    this.$el.addClass('active');

  },

  deactivateFilter: function () {

    this.state.remove(this.group);
    this.$el.find('input').val('');
    this.$el.removeClass('active');
    this.activeFilter = null;

  },

});
