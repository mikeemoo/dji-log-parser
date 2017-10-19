"use strict";

var DJIBuffer = require("../djibuffer");

var MODE = {
  0: "YawNoFollow",
  1: "FPV",
  2: "YawFollow",
  100: "OTHER"
};

function Gimbal(buffer, index, key) {
  DJIBuffer.call(this, buffer, index, key);
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

Gimbal.prototype.getYawAngle = function() {
  return this.readShort(8, 2);
}

Gimbal.prototype.getJoystickVerDirection = function() {
  return this.readInt(8, 1) & 3;
}

Gimbal.prototype.getJoystickHorDirection = function() {
  return (this.readInt(8, 1) >> 2) & 3;
}

Gimbal.prototype.isAutoCalibration = function() {
  return (this.readInt(10, 1) & 8) != 0;
}

Gimbal.prototype.autoCalibrationResult = function() {
  return (this.readInt(10, 1) & 16) != 0;
}

Gimbal.prototype.isPitchInLimit = function() {
  return (this.readInt(10, 1) & 1) != 0;
}

Gimbal.prototype.isRollInLimit = function() {
  return (this.readInt(10, 1) & 2) != 0;
}

Gimbal.prototype.isYawInLimit = function() {
  return (this.readInt(10, 1) & 4) != 0;
}

Gimbal.prototype.isStuck = function() {
  return (this.readInt(10, 1) & 64) != 0;
}

Gimbal.prototype.getMode = function() {
  return MODE[this.readInt(6, 1) >>> 6];
}

Gimbal.prototype.getSubMode = function() {
  return (this.readInt(6, 1) >> 5) & 1;
}

Gimbal.prototype.getVersion = function() {
  return this.readShort(11, 1) & 15;
}

Gimbal.prototype.isDoubleClick = function() {
  return (this.readShort(11, 1) & 32) != 0;
}

Gimbal.prototype.isTripleClick = function() {
  return (this.readShort(11, 1) & 64) != 0;
}

Gimbal.prototype.isSingleClick = function() {
  return (this.readShort(11, 1) & 128) != 0;
}

module.exports = Gimbal;