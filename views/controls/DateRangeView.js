/* global require: false */
/* global module: false */
/* global dataLayer: false */

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
    this.defaultValue = this.$el.find('input').data('defaultValue') || '';

    this.listenTo(this.state, 'state:reset', this.deactivate.bind(this));

  },

  deactivate: function () {

    this.trigger('filter:deactivate', this.activeFilter);
    this.$el.find('input').val(this.defaultValue);
    this.$el.removeClass('active');

  },

  onChange: function (e) {

    var target = $(e.target);
    var filter = target.val()
      .replace(/\s*-\s*/g, ',')
      .replace(/\//g, '-');

    if (filter) {
      this.trigger('filter:activate:replace', filter);
      this.activeFilter = filter;
      this.$el.addClass('active');
    } else if (this.activeFilter) {
      this.trigger('filter:deactivate', this.activeFilter);
      this.activeFilter = null;
      this.$el.removeClass('active');
    }

  }

});
