/* global require: false */
/* global module: false */
/* global dataLayer: false */

var $ = require('../../shims/jquery');
var Backbone = require('../../shims/backbone');

var Views = {
  Control: require('./ControlView')
};

module.exports = Views.Control.extend({

  events: {
    'change input[name=q]': 'onChange',
    'keydown input[name=q]': 'onKeyDown',
    'click .clear-button': 'clearKeyword',
    'click .submit-button': 'searchByKeyword'
  },

  initialize: function (options) {

    this.analytics = options.analytics;

    this.input = this.$el.find('input[name=q]');
    this.clearButton = this.$el.find('.clear-button');
    this.searchButton = this.$el.find('.submit-button');

  },

  /**
   * Submit the search term when the user hits the return key
   * @param  {event} e Event object
   * @return null
   */
  onKeyDown: function (e) {

    var code = e.charCode ? e.charCode : e.keyCode;

    if (code !== 13) {
      return;
    }

    this.searchByKeyword(e);

  },

  clearKeyword: function () {

    var val = this.input.val();

    if (val) {
      this.input.val('');
      this.trigger('filter:deactivate');
      this.clearButton.hide();
      this.searchButton.show();
    }

  },

  searchByKeyword: function (e) {

    // stop bubbling of 'enter' event
    if (e) e.preventDefault();

    var q = this.input.val();

    if (!q) return;

    this.trigger('filter:activate:replace', encodeURIComponent(q));

    // Send event to google
    this.sendRequestToGoogle(q);

    this.clearButton.show();
    this.searchButton.hide();

  },

  sendRequestToGoogle: function (q) {

    var location = window.location;
    var path = location.pathname;

    // remove trailing slash
    if (path.substr(-1) == '/') {
      path = path.substr(0, path.length - 1);
    }

    var url = location.protocol + '//' + location.hostname + path + '?q=' + q + '&c=program_explorer';

    this.analytics.trackPageview({ page: url });

    dataLayer.push({
      'event': 'vPageView',
      'vPath': path + '?q=' + q + '&c=program_explorer',
      'vTitle': document.title
    });

  }

});
