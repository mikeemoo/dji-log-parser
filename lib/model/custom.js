var DJIBuffer = require("../djibuffer");
var util = require("util");

function Custom(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

util.inherits(Custom, DJIBuffer);

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