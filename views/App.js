/* global require: false */
/* global module: false */

var $ = require('../shims/jquery');
var Backbone = require('../shims/backbone');

var Views = {
  Container: require('./ContainerView'),
  Controls: require('./ControlsView'),
  State: require('./StateView')
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.onFilterAdd = typeof options.onFilterAdd === 'function' ? options.onFilterAdd : function () {};
    this.onFilterRemove = typeof options.onFilterRemove === 'function' ? options.onFilterRemove : function () {};
    this.groupActiveFilters = typeof options.groupActiveFilters === 'boolean' ? options.groupActiveFilters : false;

    var state = new Views.State();
    state.ready();

    var controls = new Views.Controls({
      el: options.controls,
      groupActiveFilters: this.groupActiveFilters,
      state: state
    });

    var container = new Views.Container({
      el: options.container,
      fetcher: options.fetcher,
      models: options.models,
      offset: options.offset,
      state: state,
      views: options.views
    });

    this.listenTo(container, 'data:loading:start', function () {
      controls.deactivate();
      container.deactivate();
    });

    this.listenTo(container, 'data:loading:end', function () {
      controls.activate();
      container.activate();
    });

    // publish events for event tracking
    this.listenTo(state, 'state:filter:add', this.onFilterAdd);
    this.listenTo(state, 'state:filter:replace', this.onFilterAdd);
    this.listenTo(state, 'state:filter:remove', this.onFilterRemove);

    this.render();

  },

  render: function () {

    return this;

  }

});
