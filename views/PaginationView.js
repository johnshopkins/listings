/* global require: false */
/* global module: false */

var $ = require("../shims/jquery");
var Backbone = require("../shims/backbone");

var Views = {
  LinkedItem: require('./pagination/LinkedItemView'),
  Item: require('./pagination/ItemView')
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.state = options.state;
    this.renderedViews = [];


    // initialize the JavaScript on the server-side rendered objects

    var self = this;
    var links = this.$el.find('a');

    $.each(links, function (i, elem) {

      var view = new Views.LinkedItem({ el: $(elem) });
      self.renderedViews.push(view);

      self.listenTo(view, 'navigate', function (num) {
        self.state.replace('pg', num);
      });

    });

    var inactive = this.$el.find('span');

    $.each(inactive, function (i, elem) {

      var view = new Views.Item({ el: $(elem) });
      self.renderedViews.push(view);

    });

  },

  createView: function (page, activeFilters, template, active) {

    if (typeof active === 'undefined') {
      active = true;
    }

    var model = new Backbone.Model({
      num: page,
      activeFilters: activeFilters
    });

    var viewToUse = active ? Views.LinkedItem : Views.Item;

    var view = new viewToUse({
      model: model,
      template: template
    });

    var self = this;
    if (active) {
      this.listenTo(view, 'navigate', function (num) {
        self.state.replace('pg', num);
      });
    }

    this.$el.append(view.render().el);
    this.renderedViews.push(view);

  },

  replace: function (pagination, activeFilters) {

    // remove old views

    $.each(this.renderedViews, function (i, view) {
      view.remove();
    });


    // add new ones

    if (pagination.prev) {
      this.createView(pagination.prev, activeFilters, 'prev');
    }

    var self = this;
    $.each(pagination.pageLinks, function (i, num) {
      var active = num !== pagination.page_num;
      self.createView(num, activeFilters, 'default', active);
    });

    if (pagination.next) {
      this.createView(pagination.next, activeFilters, 'next');
    }

  }

});
