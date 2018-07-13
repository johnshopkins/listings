/* global require: false */
/* global module: false */

var $ = require('../shims/jquery');
var Backbone = require('../shims/backbone');

var Views = {
  Items: require('./ItemsView'),
  Pagination: require('./PaginationView')
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    var self = this;

    this.state = options.state;
    this.fetcher = new options.fetcher();

    this.items = new Views.Items({
      el: this.$el.find('.items'),
      models: options.models,
      views: options.views
    });

    this.pagination = new Views.Pagination({
      el: this.$el.find('.pagination'),
      state: this.state
    });

    this.listenTo(this.state, 'state:change', this.fetchData.bind(this));

    this.render();

  },

  fetchData: function (state) {

    var data = {};

    $.each(state, function (key, value) {
      data[key] = value.join(',');
    });

    // scroll the user back to the top

    // add some kind of loading graphic

    var self = this;

    this.fetcher.fetch({ data: data }).then(function () {

      self.items.replace(self.fetcher.get('collection'));
      self.pagination.replace(self.fetcher.get('pagination'), self.fetcher.get('activeFilters'));

      // remove loading graphic

    });

  },

  render: function () {

    return this;

  }

});
