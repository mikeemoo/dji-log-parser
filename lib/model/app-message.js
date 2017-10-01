"use strict";

var DJIBuffer = require("../djibuffer");

function AppMessage(buffer, index, length, key) {
  DJIBuffer.call(this, buffer, index, key);
  this.length = length;
}

AppMessage.prototype = Object.create(DJIBuffer.prototype);

AppMessage.prototype.getMessage = function() {
  return this.readString(0, this.length);
}

module.exports = AppMessage;