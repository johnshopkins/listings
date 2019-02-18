/* global require: false */
/* global module: false */

var Backbone = require('../../shims/backbone');

module.exports = Backbone.View.extend({

  className: 'active-filters',
  template: require('../../templates/active-filter.html'),

  events: {
    'click .close': 'triggerRemoveFilter'
  },

  initialize: function (options) {

    this.state = options.state;
    this.slug = options.slug;
    this.group = options.group;

  },

  triggerRemoveFilter: function () {

    this.state.remove(this.group, this.slug);
    this.removeFilter();

  },

  removeFilter: function () {

    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);

  },

  render: function () {

    this.$el.append(this.template({ slug: this.slug }));
    return this;
  }

});
