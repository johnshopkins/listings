/* global require: false */
/* global module: false */

var $ = require('../../shims/jquery');

var Views = {
  Control: require('./ControlView')
};

module.exports = Views.Control.extend({

  events: {
    'change > .input-label-group input': 'onChange',
    'click > .toggle-expand': 'toggleExpand'
  },

  initialize: function (options) {

    Views.Control.prototype.initialize.call(this, options);

    this.value = this.$el.find('> .input-label-group input').val();

    this.listenTo(this.state, 'state:filter:add:' + this.group + ':' + this.slug, this.activateFilter);
    this.listenTo(this.state, 'state:filter:remove:' + this.group + ':' + this.slug, this.deactivateFilter);

    this.toggleIcon = this.$el.find('.toggle-expand i');
    this.children = this.$el.find('.child-filters');

  },

  toggleExpand: function (e) {

    e.preventDefault();

    // toggle icon
    this.toggleIcon.toggleClass('fa-minus-square-o fa-plus-square-o');

    // change icon label
    var open = this.children.hasClass('open');
    var find = open ? 'Collapse' : 'Expand';
    var replace = open ? 'Expand' : 'Collapse';

    var label = this.toggleIcon.attr('aria-label');
    this.toggleIcon.attr('aria-label', label.replace(find, replace));

    // open child filters
    this.children.toggleClass('open');
    this.children.attr('aria-hidden', !this.children.hasClass('open'));

  },

  onChange: function (e) {

    if ($(e.target).prop("checked")) {
      this.state.add(this.group, this.value);
    } else {
      this.state.remove(this.group, this.value);
    }

  },

  activateFilter: function () {

    this.$el.addClass('active');

  },

  deactivateFilter: function () {

    this.$el.removeClass('active');

  }

});
