"use strict";

var DJIBuffer = require("../djibuffer");

function AppGPS(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

AppGPS.prototype = Object.create(DJIBuffer.prototype);

AppGPS.prototype.getLongitude = function() {
  return this.readDouble(0, 8);
}

AppGPS.prototype.getLatitude = function() {
  return this.readDouble(8, 8);
}

AppGPS.prototype.getAccuracy = function() {
  return this.readFloat(16, 4);
}

module.exports = AppGPS;
