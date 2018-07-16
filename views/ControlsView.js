/* global require: false */
/* global module: false */

var $ = require('../shims/jquery');
var Backbone = require('../shims/backbone');
var Cover = require('../lib/cover');

var Views = {
  FilterSets: {
    checkbox: require('./controls/CheckboxSetView'),
    search: require('./controls/SearchSetView')
  },
  ControlsToggle: require('./ControlsToggleView')
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.cover = new Cover(this.$el);
    this.state = options.state;
    this.render();

  },

  setupFormToggle: function () {

    var self = this;

    var toggle = new Views.ControlsToggle();
    this.$el.prepend(toggle.render().el);

    this.listenTo(toggle, 'form:display:toggle', function () {
      self.form.toggleClass('closed');
    });

  },

  renderForm: function () {

    var self = this;

    $.each(this.$el.find('fieldset'), function (i, group) {

      group = $(group);
      var type = group.data('filterType');

      if (Views.FilterSets[type]) {

        var view = new Views.FilterSets[type]({ el: group });

        self.listenTo(view, 'filter:activate:add', function (group, slug) {
          self.trigger('filter:activate:add', group, slug);
          self.state.add(group, slug);
        });

        self.listenTo(view, 'filter:activate:replace', function (group, slug) {
          self.trigger('filter:activate:replace', group, slug);
          self.state.replace(group, slug);
        });

        self.listenTo(view, 'filter:deactivate', function (group, slug) {
          self.trigger('filter:activate:deactivate', group, slug);
          self.state.remove(group, slug);
        });

      }

    });

  },

  activate: function () {
    this.cover.hide();
    this.$el.removeClass('data-loading');
  },

  deactivate: function () {
    this.cover.show();
    this.$el.addClass('data-loading');
  },

  render: function () {

    this.form = this.$el.find('form');

    this.setupFormToggle();
    this.renderForm();

    return this;

  }

});
