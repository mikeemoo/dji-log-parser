var DJIBuffer = require("../djibuffer");
var util = require("util");

function RCGPS(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

util.inherits(RCGPS, DJIBuffer);

RCGPS.prototype.getLatitude = function() {
  return this.readInt(7, 4);
}

RCGPS.prototype.getLongitude = function() {
  return this.readInt(11, 4);
}

RCGPS.prototype.getXSpeed = function() {
  return this.readInt(15, 4) / 1000;
}

RCGPS.prototype.getYSpeed = function() {
  return this.readInt(19, 4) / 1000;
}

RCGPS.prototype.getGpsNum = function() {
  return this.readShort(23, 1);
}

RCGPS.prototype.getGpsStatus = function() {
  return this.readShort(28, 2) == 1;
}

module.exports = RCGPS;