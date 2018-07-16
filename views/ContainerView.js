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

    this.scrollUser();

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

  /**
   * Scroll the user back to top of the container if they
   * are below the container
   * @return null
   */
  scrollUser: function () {

    // how far the user is scrolled
    var documentOffset = $(document).scrollTop();

    // how far down the container is
    var elementOffset = this.$el.offset().top;

    // how far below the container the user is scrolled
    var belowContainer = documentOffset - elementOffset;

    // how tall the user's window it
    var windowHeight = $(window).height();

    // if user is scrolled below the container more than the height of their window / 3
    if (documentOffset > elementOffset && belowContainer > (windowHeight / 3)) {

      // scroll the user back to the top
      $('html, body').animate({
        scrollTop: this.$el.offset().top
      }, belowContainer);

    }

  },

  activate: function () {
    this.cover.hide();
    this.$el.removeClass('data-loading');
  },

  deactivate: function () {
    this.cover.show();
    this.$el.addClass('data-loading');
  },

  render: function () {

    return this;

  }

});
