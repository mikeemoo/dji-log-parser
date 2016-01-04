"use strict";

var DJIBuffer = require("../djibuffer");

var MODE = {
  0: "YawNoFollow",
  1: "FPV",
  2: "YawFollow",
  100: "OTHER"
};

function Gimbal(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

Gimbal.prototype = Object.create(DJIBuffer.prototype);

Gimbal.prototype.getPitch = function() {
  return this.readShort(0, 2);
}

Gimbal.prototype.getRoll = function() {
  return this.readShort(2, 2);
}

Gimbal.prototype.getYaw = function() {
  return this.readShort(4, 2);
}

Gimbal.prototype.getRollAdjust = function() {
  return this.readShort(7, 1);
}

Gimbal.prototype.getCalibrationStatus = function() {
  return this.readByte(10);
}

Gimbal.prototype.getYawAngle = function() {
  return this.readShort(8, 2);
}

Gimbal.prototype.getMode = function() {
  return MODE[this.readInt(6, 1) >>> 6];
}

module.exports = Gimbal;