/* global require: false */
/* global module: false */

var $ = require('../../shims/jquery');
var Backbone = require('../../shims/backbone');

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.state = options.state;
    this.groupName = this.$el.data('filterGroup');

    this.render();

  },

  render: function () {

    var self = this;

    $.each(this.$el.find('.filter'), function (i, filter) {

      var view = new self.view({
        el: $(filter),
        state: self.state
      });

      self.listenTo(view, 'filter:activate:add', function (slug) {
        self.trigger('filter:activate:add', self.groupName, slug);
      });

      self.listenTo(view, 'filter:activate:replace', function (slug) {
        self.trigger('filter:activate:replace', self.groupName, slug);
      });

      self.listenTo(view, 'filter:deactivate', function (slug) {
        self.trigger('filter:deactivate', self.groupName, slug);
      });

    });

    return this;

  }

});
