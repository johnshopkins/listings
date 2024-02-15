/* global require: false */
/* global module: false */
/* global dataLayer: false */

const flatpickr = require('flatpickr');

var Views = {
  Control: require('./ControlView')
};

module.exports = Views.Control.extend({

  events: {
    'click .clear': 'deactivate',
    'click .fa-calendar': 'openCalendar'
  },

  initialize: function (options) {

    Views.Control.prototype.initialize.call(this, options);

    this.datepicker = flatpickr(this.$el.find('input').get(0), this.getDatepickerConfig());

    this.listenTo(this.state, 'state:reset', this.deactivate.bind(this));

  },

  openCalendar: function () {
    this.datepicker.open()
  },

  getDatepickerConfig: function () {
    const config = {
      mode: 'range',
      minDate: 'today',
      altInput: true,
      altFormat: 'n/j/y',
      dateFormat: 'Y-m-d',
      onChange: this.onChange.bind(this),
    };

    const initialValue = this.$el.find('input').data('value');
    if (initialValue) {
      config.defaultDate = initialValue.split(',');
    }

    return config;
  },

  deactivate: function () {

    this.datepicker.clear();

    this.trigger('filter:deactivate', this.activeFilter);
    this.$el.removeClass('active');

  },

  onChange: function (selectedDates, dateStr, instance) {

    instance.element.value = dateStr.replace('to', '-');

    if (selectedDates.length < 2) {
      // wait for the user to select the end date
      return;
    }

    const filter = selectedDates.map(date => {
      return instance.formatDate(date, 'Y-m-d')
    }).join(',');

    if (filter) {
      this.trigger('filter:activate:replace', filter);
      this.activeFilter = filter;
      this.$el.addClass('active');
    } else if (this.activeFilter) {
      this.trigger('filter:deactivate', this.activeFilter);
      this.activeFilter = null;
      this.$el.removeClass('active');
    }

  }

});
