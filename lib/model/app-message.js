var DJIBuffer = require("../djibuffer");
var util = require("util");

function AppMessage(buffer, index, length) {
  this.buffer = buffer;
  this.index = index;
  this.length = length;
}

util.inherits(AppMessage, DJIBuffer);

AppMessage.prototype.getMessage = function() {
  return this.buffer.toString("utf8", this.index, this.index + this.length);
}

module.exports = AppMessage;