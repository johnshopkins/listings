/* global require: false */
/* global module: false */

var $ = require("../shims/jquery");
var Backbone = require("../shims/backbone");

module.exports = Backbone.View.extend({

  show: function () {
    this.$el.show();
  },

  hide: function () {
    this.$el.hide();
  }

});
