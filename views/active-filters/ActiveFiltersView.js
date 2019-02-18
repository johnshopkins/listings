/* global require: false */
/* global module: false */

var Backbone = require('../../shims/backbone');

var Views = {
  ActiveFilter: require('./ActiveFilterView')
};

module.exports = Backbone.View.extend({

  className: 'active-filters',

  initialize: function (options) {

    this.state = options.state;
    this.filters = {};

    this.listenTo(this.state, 'state:filter:add', this.add);
    this.listenTo(this.state, 'state:filter:remove', this.removeFilter);
    this.listenTo(this.state, 'state:filter:replace', this.replace);
    this.listenTo(this.state, 'state:reset', this.removeAll);

  },

  getKey(group, slug) {

    return slug ? group + '-' + slug : group;

  },

  add: function (group, slug) {

    var view = this.appendView(group, slug);

    var key = this.getKey(group, slug);
    this.filters[key] = view;

    console.log(this.filters)

  },

  replace: function (group, slug) {

    var key = this.getKey(group);
    var filter = this.filters[key];

    if (filter) {
      filter.removeFilter();
    }


    var view = this.appendView(group, slug);

    this.filters[key] = view;

    console.log(this.filters)

  },

  appendView: function (group, slug) {

    var view = new Views.ActiveFilter({
      group: group,
      slug: slug,
      state: this.state
    });

    this.$el.append(view.render().el);

    return view;

  },

  removeFilter: function (group, slug) {

    var key = this.getKey(group, slug);
    var filter = this.filters[key];

    if (filter) {
      filter.removeFilter();
    }

  },

  removeAll: function () {

    $.each(this.filters, function (i, filter) {
      filter.removeFilter();
    });

    this.filters = {};

  }

});
