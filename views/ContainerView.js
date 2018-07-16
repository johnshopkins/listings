/* global require: false */
/* global module: false */

var $ = require('../shims/jquery');
var _ = require('../shims/underscore');
var Backbone = require('../shims/backbone');
var Cover = require('../lib/cover');

var Views = {
  Items: require('./ItemsView'),
  Pagination: require('./PaginationView')
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.cover = new Cover(this.$el);
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

    this.listenTo(this.state, 'state:change', _.debounce(this.fetchData.bind(this), 200, false));

    this.render();

  },

  fetchData: function (state) {

    this.trigger('data:loading:start');
    this.scrollUser();

    var data = {};

    $.each(state, function (key, value) {
      data[key] = value.join(',');
    });

    var self = this;

    this.fetcher.fetch({ data: data }).then(function () {

      self.items.replace(self.fetcher.get('collection'));
      self.pagination.replace(self.fetcher.get('pagination'), self.fetcher.get('activeFilters'));
      self.trigger('data:loading:end');

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

      var speeds = {
        slow: 1,
        fast: 2
      };

      var speed = belowContainer / (belowContainer > 1000 ? speeds.fast : speeds.slow);

      // scroll the user back to the top
      $('html, body').animate({
        scrollTop: this.$el.offset().top
      }, speed);

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
