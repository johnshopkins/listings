/* global require: false */
/* global module: false */

var Views = {
  Control: require('./ControlView')
};

module.exports = Views.Control.extend({

  events: {
    'change > .input-label-group input': 'onChange',
    'click > .toggle-expand': 'toggleExpand',
    'click button.close': 'toggleExpand'
  },

  initialize: function (options) {

    Views.Control.prototype.initialize.call(this, options);

    this.toggleIcon = this.$el.find('.toggle-expand i');
    this.children = this.$el.find('.child-filters');

    var self = this;
    this.listenTo(this.state, 'state:reset', function () {
      self.$el.removeClass('active');
    });

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

    var target = $(e.target);
    var checked = target.prop("checked");

    if (checked) {
      this.trigger('filter:activate:add', target.val());
      this.$el.addClass('active');
    } else {
      this.trigger('filter:deactivate', target.val());
      this.$el.removeClass('active');
    }

  }

});
