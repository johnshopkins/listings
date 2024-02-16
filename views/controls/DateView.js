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
      inline: true,
      maxDate: 'today',
      minDate: new Date().fp_incr(-30), // 30 days ago
      altInput: true,
      altFormat: 'n/j/y',
      dateFormat: 'Y-m-d',
      disable: [
        (date) => date.getDay() === 6 || date.getDay() === 0
      ],
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

    const filter = instance.formatDate(selectedDates[0], 'Y-m-d');

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
