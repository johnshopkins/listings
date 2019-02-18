/* global require: false */
/* global module: false */

var $ = require('../../shims/jquery');
var Backbone = require('../../shims/backbone');

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.state = options.state;
    this.group = this.$el.data('filterGroup');

    this.render();

  },

  render: function () {

    var self = this;

    $.each(this.$el.find('.filter'), function (i, filter) {

      new self.view({
        el: $(filter),
        group: self.group,
        state: self.state
      });

    });

    return this;

  }

});
