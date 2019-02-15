/* global require: false */
/* global module: false */
/* global dataLayer: false */

var $ = require('../../shims/jquery');
var Backbone = require('../../shims/backbone');
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

    this.trigger('filter:deactivate', this.activeFilter);
    this.$el.find('input').val('');
    this.$el.removeClass('active');

  },

  onChange: function (e) {

    var target = $(e.target);
    var slug = target.val()
      .replace(/\s*-\s*/g, ',')
      .replace(/\//g, '-');

    if (slug) {
      this.trigger('filter:activate:replace', slug);
      this.activeFilter = slug;
      this.$el.addClass('active');
    } else if (this.activeFilter) {
      this.trigger('filter:deactivate', this.activeFilter);
      this.activeFilter = null;
      this.$el.removeClass('active');
    }

  }

});
