/* global require: false */
/* global module: false */

var getScriptData = require("get-script-data");

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.models = options.models;
    this.views = options.views;

    this.renderedViews = [];


    // initialize the JavaScript on the server-side rendered objects
    var self = this;
    $.each(this.$el.find('.item'), function (i, elem) {

      elem = $(elem);

      var data = getScriptData(elem);

      if (!data || !data.type) return;

      if (!self.models[data.type] || !self.views[data.type]) return;

      var model = new self.models[data.type](data);

      var view = new self.views[data.type]({
        el: elem,
        model: model
      });

      self.renderedViews.push(view);

    });

  },

  replace: function (collection) {

    // remove old views

    $.each(this.renderedViews, function (i, view) {
      view.remove();
    });

    if (!collection) {
      return;
    }

    // add new ones

    var self = this;
    collection.each(function (model) {

      var type = model.get('type');
      var view = new self.views[type]({ model: model });

      self.renderedViews.push(view);

      self.$el.append(view.render().el);

    });

  }

});
