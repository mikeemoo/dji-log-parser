"use strict";

var DJIBuffer = require("../djibuffer");

function RC(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

RC.prototype = Object.create(DJIBuffer.prototype);

RC.prototype.getAileron = function() {
  return this.readInt(0, 2);
}

RC.prototype.getElevator = function() {
  return this.readInt(2, 2);
}

RC.prototype.getThrottle = function() {
  return this.readInt(4, 2);
}

RC.prototype.getRudder = function() {
  return this.readInt(6, 2);
}

RC.prototype.getGyroValue = function() {
  return this.readInt(8, 2);
}

RC.prototype.getFootStool = function() {
  return (this.readInt(11, 1) >> 6 & 4) == 3;
}

RC.prototype.getMode = function() {
  return this.readInt(11, 1) >> 4 & 3;
}

RC.prototype.getGoHome = function() {
  return this.readInt(11, 1) >> 3 & 1;
}

RC.prototype.getCoronaChange = function() {
  return (this.readInt(10, 1) >> 7 & 1) == 1;
}

RC.prototype.getChangeDirection = function() {
  return this.readInt(10, 1) >> 6 & 1;
}

RC.prototype.getOffset = function() {
  return this.readInt(10, 1) >> 1 & 31;
}

RC.prototype.getIsPushCorona = function() {
  return this.readInt(10, 1) & 1;
}

RC.prototype.getRecordStatus = function() {
  return (this.readInt(12, 1) >> 7 & 1) == 1;
}

RC.prototype.getShutterStatus = function() {
  return (this.readInt(12, 1) >> 6 & 1) == 1;
}

RC.prototype.getPlayback = function() {
  return this.readInt(12, 1) >> 5 & 1;
}

RC.prototype.getCustom2 = function() {
  return this.readInt(12, 1) >> 3 & 1;
}

RC.prototype.getCustom1 = function() {
  return this.readInt(12, 1) >> 4 & 1;
}

module.exports = RC;