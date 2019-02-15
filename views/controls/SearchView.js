/* global require: false */
/* global module: false */
/* global dataLayer: false */

var Views = {
  Control: require('./ControlView')
};

module.exports = Views.Control.extend({

  events: {
    'keydown input[name=keyword]': 'onKeyDown',
    // 'focus input[name=keyword]': 'clearKeywordFromInput',
    'focusout input[name=keyword]': 'maybeDeactivateKeyword',
    'click .clear-button': 'deactivateKeyword',
    'click .submit-button': 'searchByKeyword'
  },

  initialize: function (options) {

    Views.Control.prototype.initialize.call(this, options);

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

    // user is typing. make sure the right buttons are showing
    // clear button could be showing if user is editing their
    // previous search without first removing focus from searchbox
    this.clearButton.removeClass('show');
    this.searchButton.addClass('show');

    if (code !== 13) {
      return;
    }

    this.searchByKeyword(e);

  },

  /**
   * Clear the keywor from the input,
   * but don't deactivate the filter.
   * @return {string} Cleared value
   */
  clearKeywordFromInput: function () {

    var val = this.input.val();

    if (val) {
      this.input.val('');
      this.clearButton.removeClass('show');
      this.searchButton.addClass('show');
    }

    return val;

  },

  /**
   * After the input has lost focus, deactivate the filter
   * if there is no value. This can happen when a user has
   * searched for something, refocused the searchbox, but
   * doesn't search again.
   * @return null
   */
  maybeDeactivateKeyword: function () {

    var val = this.input.val();

    if (!val) {
      // reset filter
      this.state.remove(this.group);
      this.clearButton.removeClass('show');
      this.searchButton.addClass('show');
    }

  },

  deactivateKeyword: function () {

    var cleared = this.clearKeywordFromInput();

    if (cleared) {
      this.state.remove(this.group);
    }

  },

  searchByKeyword: function (e) {

    // stop bubbling of 'enter' event
    if (e) e.preventDefault();

    var q = this.input.val();

    if (!q) return;

    this.state.replace(this.group, encodeURIComponent(q));

    this.clearButton.addClass('show');
    this.searchButton.removeClass('show');

  },

  deactivateFilter: function () {
    this.clearButton.removeClass('show');
    this.searchButton.addClass('show');
  }

});
