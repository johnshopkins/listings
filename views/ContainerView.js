/* global require: false */
/* global module: false */

var $ = require('../shims/jquery');
var Backbone = require('../shims/backbone');
var Cover = require('../lib/cover');
var debounce = require('lodash.debounce');

var Views = {
  Error: require('./ErrorView'),
  Items: require('./ItemsView'),
  NoResults: require('./NoResultsView'),
  Pagination: require('./PaginationView')
};

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.cover = new Cover(this.$el);
    this.state = options.state;
    this.fetcher = new options.fetcher();
    this.offset = options.offset || 0;

    this.items = new Views.Items({
      el: this.$el.find('.items'),
      models: options.models,
      views: options.views
    });

    this.pagination = new Views.Pagination({
      el: this.$el.find('.pagination'),
      state: this.state
    });

    this.noresults = new Views.NoResults({
      el: this.$el.find('.noresults')
    });

    this.error = new Views.Error({
      el: this.$el.find('.error')
    });

    this.listenTo(this.state, 'state:change', debounce(this.fetchData.bind(this), 200, false));

    this.render();

  },

  fetchData: function (state) {

    this.trigger('data:loading:start');
    this.noresults.hide();
    this.error.hide();

    var data = {};

    $.each(state, function (key, value) {
      data[key] = value.join(',');
    });

    var deferreds = [
      this.scrollUser(),
      this.fetcher.fetch({ data: data })
    ];

    var self = this;
    $.when.apply($, deferreds)
      .done(function() {
        
        if (self.fetcher.get('error')) {

          self.error.show();
          self.items.replace();
          self.pagination.replace();

        } else {

          var collection = self.fetcher.get('collection');

          if (collection.length === 0) {
            self.noresults.show();
          }

          self.items.replace(collection);
          self.pagination.replace(self.fetcher.get('pagination'), self.fetcher.get('activeFilters'));
        }

        self.trigger('data:loading:end');

      });

  },

  /**
   * Scroll the user back to top of the container if they
   * are below the container
   * @return null
   */
  scrollUser: function () {

    var defered = $.Deferred();

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
        slow: 2,
        fast: 3
      };

      var speed = belowContainer / (belowContainer > 1000 ? speeds.fast : speeds.slow);

      // scroll the user back to the top
      $('html, body').animate({
        scrollTop: this.$el.offset().top - this.offset
      }, speed, 'swing', function () {
        // note: this callback will fire twice due to being called on two elements
        defered.resolve();
      });

    } else {
      // no need to scroll, resolve deferred now
      defered.resolve();
    }

    return defered;

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
