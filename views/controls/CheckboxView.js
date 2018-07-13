/* global require: false */
/* global module: false */

var $ = require('../../shims/jquery');
var Backbone = require('../../shims/backbone');

var Views = {
  Control: require('./ControlView')
};

module.exports = Views.Control.extend({

  events: {
    'change input': 'onChange',
    'click .toggle-expand': 'toggleExpand'
  },

  toggleExpand: function (e) {

    // toggle icon
    this.toggleIcon.toggleClass('fa-minus-square-o fa-plus-square-o');

    // change icon label
    var open = this.childFilters.hasClass('open');
    var find = open ? 'Collapse' : 'Expand';
    var replace = open ? 'Expand' : 'Collapse';

    var label = this.toggleIcon.attr('aria-label');
    this.toggleIcon.attr('aria-label', label.replace(find, replace));

    // open child filters
    this.childFilters.toggleClass('open');
    this.childFilters.attr('aria-hidden', !this.childFilters.hasClass('open'));

  },

  onChange: function (e) {

    Views.Control.prototype.onChange.call(this, e);

    var target = $(e.target);
    var checked = target.prop("checked");

    if (checked) {
      this.trigger('filter:activate:add', target.val());
    } else {
      this.trigger('filter:deactivate', target.val());
    }

  }

});
