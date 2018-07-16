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

    var state = new Views.State();
    state.ready();

    var controls = new Views.Controls({
      el: options.controls,
      state: state
    });

    new Views.Container({
      el: options.container,
      fetcher: options.fetcher,
      models: options.models,
      state: state,
      views: options.views
    });

    this.render();

  },

  render: function () {

    return this;

  }

});
