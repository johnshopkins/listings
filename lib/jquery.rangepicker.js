(function ($) {

  var Rangepicker = function (elem, callback) {

    // // add onAfterUpdate callback to datepicker
    $.datepicker._defaults.onAfterUpdate = null;

    // add proxy to internal __updateDatepicker to call that callback
    var datepicker__updateDatepicker = $.datepicker._updateDatepicker;

    $.datepicker._updateDatepicker = function (inst) {

      datepicker__updateDatepicker.call(this, inst);

      var onAfterUpdate = this._get(inst, "onAfterUpdate");

      if (onAfterUpdate) {

        var thisIs = inst.input ? inst.input[0] : null;
        var args = [(inst.input ? inst.input.val() : ''), inst];

        onAfterUpdate.apply(thisIs, args);
      }

    };

    var self = this;

    this.elem = elem;
    this.callback = typeof callback === "function" ? callback : function () {};

    this.datepickerDiv = $("<div />");
    this.elem.parent().append(this.datepickerDiv);

    // set the initial range
    this.parseDates(this.elem.val());

    // attach datepicker to datepickerDiv div to avoid the default functionality
    // of the datepicker closing when a date is selected
    this.datepickerDiv
      .hide()
      .datepicker({
        minDate: 0,
        showButtonPanel: true,
        onSelect: self.onSelect.bind(self),
        beforeShowDay: self.beforeShowDay.bind(self),
        onAfterUpdate: self.onAfterUpdate.bind(self)
      })
      .position({
        my: "left top",
        at: "left bottom",
        of: self.elem
      });

    this.elem.on("focus", this.onFocus.bind(this));

  };

  Rangepicker.prototype.hide = function () {
    this.datepickerDiv.hide();
    this.onUnfocus();
  };

  Rangepicker.prototype.parseDates = function (v) {

    try {

        // range
        if ( v.indexOf(" - ") > -1 ) {
            var existingDate = v.split(" - ");

            this.prv = $.datepicker.parseDate("mm/dd/yy", existingDate[0]).getTime();
            this.cur = $.datepicker.parseDate("mm/dd/yy", existingDate[1]).getTime();

        // single date
        } else if ( v.length > 0 ) {
            this.prv = this.cur = $.datepicker.parseDate("mm/dd/yy", v).getTime();
            this.datepickerDiv.datepicker("setDate", new Date(this.cur));
        }

    } catch (e) {
        cur = prv = -1;
    }

  };

  Rangepicker.prototype.onFocus = function () {

    this.elem.show();

    this.parseDates(this.value);

    this.datepickerDiv.datepicker("refresh").show();

  };

  Rangepicker.prototype.onUnfocus = function () {
    this.elem.hide();
  };

  Rangepicker.prototype.onSelect = function (dateText, inst) {

    // formated dates that display in the input
    var d1, d2;

    // set the previous selection the current value of cur
    this.prv = this.cur;

    // set the value of cur to be the date just selected
    this.cur = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();


    // update the input's value

    // only one date has been selected
    if (typeof this.prv === 'undefined' || this.prv === -1 || this.prv === this.cur ) {
      this.prv = this.cur;
      this.elem.val( dateText );

    // a range has been selected
    } else {
      d1 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.min(this.prv, this.cur)), {} );
      d2 = $.datepicker.formatDate( 'mm/dd/yy', new Date(Math.max(this.prv, this.cur)), {} );
      this.elem.val(d1 + " - " + d2);
    }
  };

  Rangepicker.prototype.onClose = function (dateText) {

    var dates = [];

    // range
    if ( dateText.indexOf(" - ") > -1 ) {
      dates = dateText.split(" - ");

    // single date
    } else if ( dateText.length > 0 ) {
      dates.push(dateText);
    }

    // check formatting of elements to make sure they are real dates
    var passed = true;
    var regex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    $.each(dates, function (i, date) {
      if (!regex.test(date)) {
        passed = false;
      }
    });

    if (dates.length > 0 && passed) {
      this.callback.call(this.elem, dates);
      this.elem.trigger('change');
    } else {
      return;
    }

  };

  Rangepicker.prototype.beforeShowDay = function (date) {

      var clss = "";

      if (date.getTime() >= Math.min(this.prv, this.cur) && date.getTime() <= Math.max(this.prv, this.cur)) {
          clss = "date-range-selected";
      }

      return [true, clss];
  };

  Rangepicker.prototype.onAfterUpdate = function (inst) {

    var buttonPane = this.datepickerDiv.find(".ui-datepicker-buttonpane");
    var button = buttonPane.find(".apply-button");

    if (button.length > 0) return;

    var self = this;

    $("<button />")
      .addClass("apply-button ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all")
      .attr("type", "button")
      .attr("data-handler", "hide")
      .attr("data-event", "click")
      .html("Apply")
      .appendTo(buttonPane)
      .on("click", function() {
        self.datepickerDiv.hide();
        self.onClose.call(self, self.elem.val());
      });
  };

  $.fn.rangepicker = function (args) {

      this.each(function () {
        new Rangepicker($(this), args);
      });

  };

})(jQuery);
