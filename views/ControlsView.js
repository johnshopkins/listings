/* global require: false */
/* global module: false */

var $ = require('../shims/jquery');
var Backbone = require('../shims/backbone');
var Cover = require('../lib/cover');

var breakpoints = require('breakpoints');
var WindowResizeWatcher = require('window-resize-watcher');

var Views = {
  FilterSets: {
    checkbox: require('./controls/CheckboxSetView'),
    daterange: require('./controls/DateRangeSetView'),
    search: require('./controls/SearchSetView')
  },
  ControlsToggle: require('./ControlsToggleView')
};

module.exports = Backbone.View.extend({

  filterStyle: null,

  events: {
    'reset form': 'clearFilters'
  },

  initialize: function (options) {

    this.cover = new Cover(this.$el);
    this.state = options.state;

    var resizer = new WindowResizeWatcher(vent, 'academics');
    $(window).on('resize', resizer.handleResize.bind(resizer));

    this.setFilterStyle();
    this.listenTo(vent, 'academics:winresize:done', this.setFilterStyle);

    this.render();

  },

  setFilterStyle: function (e) {

    // mobile filters are only triggered via width
    var newStyle = (breakpoints.getWidth() === 'hand' || breakpoints.getWidth() === 'lap') ? 'mobile' : 'nonmobile';

    if (this.filterStyle === null) {
      // set initial style
      this.filterStyle = newStyle;
      return;
    }

    if (this.filterStyle !== newStyle) {

      this.filterStyle = newStyle;    
      
      if (this.$el.find($(':focus')).length === 0 || this.filterStyle === 'nonmobile') {
        // user is not focused inside the filters OR going from mobile to nonmobile; do nothing
        return;
      }

      // if the open filters button is visible, that means the filters are
      // closed and we should point the user to open button. if the filters
      // are already open, keep the focus where it is.
      var openFiltersButton = this.$el.find('.display-nav button.open');
      if (openFiltersButton.is(':visible')) {
        openFiltersButton.focus();
      }

    }

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

  },

  renderForm: function () {

    var self = this;

    $.each(this.$el.find('fieldset'), function (i, group) {

      group = $(group);
      var type = group.data('filterType');

      if (Views.FilterSets[type]) {

        var view = new Views.FilterSets[type]({
          el: group,
          state: self.state
        });

        self.listenTo(view, 'filter:activate:add', function (group, slug) {
          self.trigger('filter:activate:add', group, slug);
          self.state.add(group, slug);
          self.maybeSendToPageOne(group, self.state);
        });

        self.listenTo(view, 'filter:activate:replace', function (group, slug) {
          self.trigger('filter:activate:replace', group, slug);
          self.state.replace(group, slug);
          self.maybeSendToPageOne(group, self.state);
        });

        self.listenTo(view, 'filter:deactivate', function (group, slug) {
          self.trigger('filter:activate:deactivate', group, slug);
          self.state.remove(group, slug);
          self.maybeSendToPageOne(group, self.state);
        });

      }

    });

  },

  /**
   * Send the user back back page 1 for
   * state changes other than navigation
   * @param  {string} group Filter group
   * @return null
   */
  maybeSendToPageOne: function (group, state) {

    if (group === 'pg') {
      return;
    }

    if (group !== 'pg') {
      state.remove('pg');
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
    this.renderForm();

    return this;

  }

});
