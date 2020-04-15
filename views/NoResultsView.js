/* global require: false */
/* global module: false */

module.exports = Backbone.View.extend({

  show: function () {
    this.$el.show();
  },

  hide: function () {
    this.$el.hide();
  }

});
