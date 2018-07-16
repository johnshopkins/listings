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
    'change input[name=keyword]': 'onChange',
    'keydown input[name=keyword]': 'onKeyDown',
    'click .clear-button': 'clearKeyword',
    'click .submit-button': 'searchByKeyword'
  },

  initialize: function (options) {

    this.input = this.$el.find('input[name=keyword]');
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

    this.clearButton.show();
    this.searchButton.hide();

  }

});
