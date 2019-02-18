/* global require: false */
/* global module: false */

var $ = require('../shims/jquery');
var Backbone = require('../shims/backbone');
var Cover = require('../lib/cover');

var Views = {
  ActiveFilters: require('./active-filters/ActiveFiltersView'),
  FilterSets: {
    checkbox: require('./controls/CheckboxSetView'),
    daterange: require('./controls/DateRangeSetView'),
    search: require('./controls/SearchSetView')
  },
  ControlsToggle: require('./ControlsToggleView')
};

module.exports = Backbone.View.extend({

  events: {
    'reset form': 'clearFilters'
  },

  initialize: function (options) {

    this.cover = new Cover(this.$el);
    this.state = options.state;

    this.listenTo(this.state, 'state:filter:add', this.maybeSendToPageOne);
    this.listenTo(this.state, 'state:filter:remove', this.maybeSendToPageOne);
    this.listenTo(this.state, 'state:filter:replace', this.maybeSendToPageOne);

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

  clearFilters: function (e) {

    this.state.reset();
    this.activeFilters.removeAll();

  },

  renderForm: function () {

    var self = this;

    $.each(this.$el.find('fieldset'), function (i, group) {

      group = $(group);
      var type = group.data('filterType');

      if (Views.FilterSets[type]) {

        new Views.FilterSets[type]({
          el: group,
          state: self.state
        });

      }

    });

  },

  renderActiveFilters: function () {

    this.activeFilters = new Views.ActiveFilters({ state: this.state });
    this.$el.prepend(this.activeFilters.render().el);

  },

  /**
   * Send the user back back page 1 for
   * state changes other than navigation
   * @param  {string} group Filter group
   * @return null
   */
  maybeSendToPageOne: function (group) {

    if (group !== 'pg') {
      this.state.remove('pg');
    }

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
    this.renderActiveFilters();
    this.renderForm();

    return this;

  }

});
