var Cover = function (elem) {

  this.elem = elem;

  this.cover = $('<div />')
    .addClass('cover')
    .css({
      height: this.elem.height(),
      width: this.elem.width(),
      position: 'absolute',
      top: 0,
      left: 0
    })
    .hide();

  this.elem.append(this.cover);

};

Cover.prototype.hide = function () {
  this.cover.hide();
};

Cover.prototype.show = function () {
  this.cover
    // update width and height
    .css({
      height: this.elem.height(),
      width: this.elem.width(),
    })
    .show();
};

module.exports = Cover;
