/* global require: false */
/* global module: false */

var $ = require('../../shims/jquery');
var Backbone = require('../../shims/backbone');

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.analytics = options.analytics;
    this.groupName = this.$el.data('filterGroup');

    this.render();

  },

  render: function () {

    var self = this;

    $.each(this.$el.find('.filter'), function (i, filter) {

      var view = new self.view({
        analytics: self.analytics,
        el: $(filter)
      });

      self.listenTo(view, 'filter:activate:add', function (filter) {
        self.trigger('filter:activate:add', self.groupName, filter);
      });

      self.listenTo(view, 'filter:activate:replace', function (filter) {
        self.trigger('filter:activate:replace', self.groupName, filter);
      });

      self.listenTo(view, 'filter:deactivate', function (filter) {
        self.trigger('filter:deactivate', self.groupName, filter);
      });

    });

    return this;

  }

});
