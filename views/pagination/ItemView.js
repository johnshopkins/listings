/* global require: false */
/* global module: false */

var $ = require("../../shims/jquery");
var Backbone = require("../../shims/backbone");

var templates = {
  default: require('../../templates/nav-inactive.html')
};

module.exports = Backbone.View.extend({

  tagName: 'span',
  className: 'current',
  template: templates.default,

  render: function () {

    this.$el.data('num', this.model.get('num'));
    this.$el.append(this.template(this.model.toJSON()));

    return this;

  }

});
