"use strict";

var DJIBuffer = require("../djibuffer");

function Custom(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

Custom.prototype = Object.create(DJIBuffer.prototype);

Custom.prototype.getData = function() {
  return [
    this.readByte(0),
    this.readByte(1),
    this.readFloat(2, 4),
    this.readFloat(6, 4),
    // long(10, 8)
  ];
}

module.exports = Custom;