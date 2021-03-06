/* global require: false */
/* global module: false */

var Views = {
  Pagination: require('./ItemView')
};

var templates = {
  default: require('../../templates/nav-active.html'),
  next: require('../../templates/nav-next.html'),
  prev: require('../../templates/nav-prev.html')
};

module.exports = Views.Pagination.extend({

  tagName: 'a',
  className: '',

  events: {
    'click': 'onClick'
  },

  initialize: function (options) {

    if (options.template && options.template === 'prev') {
      this.$el.addClass('prev button x-small');
    } else if (options.template && options.template === 'next') {
      this.$el.addClass('next button x-small');
    } else if (options.template && options.template === 'default') {
      this.$el.addClass('pagination-link');
    }

    this.template = options.template && templates[options.template] ? templates[options.template] : templates.default;

  },

  onClick: function (e) {

    e.preventDefault();

    var num = $(e.target).closest('a').data('num');

    // validate given number
    num = parseInt(num);
    if (isNaN(num) || num < 1) {
      num = 1;
    }

    this.trigger('navigate', num);

  },

  generateUrl: function (page, activeFilters) {

    var querystring = '?pg=' + page;
    
    if (Object.keys(activeFilters).length > 0) {

      var queryParts = [];

      $.each(activeFilters, function (key, value) {
        queryParts.push(key + '=' + value.join(','));
      });
      
      querystring = querystring + '&' + queryParts.join('&');

    }

    return location.pathname + querystring;

  },

  render: function () {
    this.$el.attr('href', this.generateUrl(this.model.get('num'), this.model.get('activeFilters')));
    Views.Pagination.prototype.render.call(this);

    return this;

  }

});
