/* global require: false */
/* global module: false */

module.exports = Backbone.View.extend({

  initialize: function (options) {

    this.state = {};

  },

  ready: function () {

    this.state = this.deserializeQueryString();

  },

  getState: function () {

    return this.state;

  },

  /**
   * Deserializes a query string (if present) into in an object.
   * @return {object|null}
   */
  deserializeQueryString: function () {

    var querystring = window.location.search.replace(/^\?/, '');
    if (!querystring) return {};

    var state = {};
    var groups = [];

    groups = querystring.split("&");

    groups.forEach(function(group) {
      var pair = group.split("=");
      var groupName = pair[0];
      var selected = decodeURIComponent(pair[1]);

      if (selected) {
        state[groupName] = selected.split(",");
      }

    });

    return state;
  },

  reset: function () {

    if (Object.keys(this.state).length === 0) {
      // prevent multiple clicks
      return;
    }

    this.state = {};
    this.trigger('state:change', this.state);
    this.trigger('state:reset');
    this.setQueryString();

  },

  add: function (group, slug) {

    if (!this.state[group]) {
      this.state[group] = [];
    }

    this.state[group].push(slug);
    this.trigger('state:change', this.state);
    this.setQueryString();

  },

  remove: function (group, slug) {

    if (!this.state[group]) {
      // can happen when removing the 'pg' group for other state changes
      // before the 'pg' group was even triggered
      return;
    }

    if (slug) {

      // remove just this slug from the active filters

      var i = this.state[group].indexOf(slug);

      if (i === -1) {
        // the slug isnt in this group
        // not sure when this would happen, but made this failsafe just in case
        return;
      }

      this.state[group].splice(i, 1);

      if (this.state[group].length === 0) {
        delete this.state[group];
      }

    } else {

      // remove entire group
      delete this.state[group];

    }

    this.trigger('state:change', this.state);
    this.setQueryString();

  },

  replace: function (group, slug) {

    this.state[group] = [slug];

    this.trigger('state:change', this.state);
    this.setQueryString();

  },

  /**
   * Serializes the state object into a string.
   *
   * @return  {string}
   */

  serializeGroupsState: function () {

    var output = '';

    for (var key in this.state) {
      var values = this.state[key];

      if (Array.isArray(values)) {
        // array
        if (!values.length) continue;

        output += key + '=';
        output += values.join(',');
        output += '&';

      } else {
        // string
        output += key + '=' + values;
      }

    }

    output = output.replace(/&$/g, '');

    return output;

  },

  setQueryString: function (state) {

    if (!history.pushState) {
      // IE9 doesn't support this
      return;
    }

    // Create a URL query string by serializing the groupsState object
    var serialized = this.serializeGroupsState();
    var newQueryString = '?' + serialized;

    if (serialized && newQueryString !== window.location.search) {
      // set new query string
      history.pushState(null, document.title, window.location.pathname + newQueryString);
    } else if (!serialized) {
      // no filters selected, remove query string
      history.pushState(null, document.title, window.location.pathname);
    } else {
      // leave the query string alone - page just initialized
    }

  }

});
