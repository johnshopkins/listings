/* global require: false */
/* global module: false */

var Backbone = require('../../shims/backbone');

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.group = options.group;
    this.state = options.state;

    this.listenTo(this.state, 'state:reset', this.deactivateFilter);

  },

  deactivateFilter: function () {

  }

});
