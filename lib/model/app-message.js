"use strict";

var DJIBuffer = require("../djibuffer");

function AppMessage(buffer, index, length) {
  this.buffer = buffer;
  this.index = index;
  this.length = length;
}

AppMessage.prototype = Object.create(DJIBuffer.prototype);

AppMessage.prototype.getMessage = function() {
  return this.buffer.toString("utf8", this.index, this.index + this.length);
}

module.exports = AppMessage;