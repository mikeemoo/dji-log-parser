"use strict";

var DJIBuffer = require("../djibuffer");

var CONN_STATUS = {
  0: "NORMAL",
  1: "INVALID",
  2: "EXCEPTION",
  100: "OTHER"
};

function CenterBattery(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

CenterBattery.prototype = Object.create(DJIBuffer.prototype);

CenterBattery.prototype.getRelativeCapacity = function() {
  return this.readInt(0, 1);
}

CenterBattery.prototype.getCurrentPV = function() {
  return this.readInt(1, 2);
}

CenterBattery.prototype.getCurrentCapacity = function() {
  return this.readInt(3, 2);
}

CenterBattery.prototype.getFullCapacity = function() {
  return this.readInt(5, 2);
}

CenterBattery.prototype.getLife = function() {
  return this.readInt(7, 1);
}

CenterBattery.prototype.getLoopNum = function() {
  return this.readInt(8, 2);
}

CenterBattery.prototype.getErrorType = function() {
  return this.readInt(10, 4);
}

CenterBattery.prototype.getCurrent = function() {
  return this.readInt(14, 2);
}

CenterBattery.prototype.getPartVoltages = function() {
  var voltages = [];
  for (var i = 0; i < 6; i++) {
    voltages[i] = this.readInt(16 + (i * 2), 2);
  }
  return voltages;
}

CenterBattery.prototype.getSerialNo = function() {
  return this.readInt(28, 2);
}

CenterBattery.prototype.getProductDate = function() {
  var n2 = this.readInt(30, 2);
  return [ 
    ((n2 & 65024) >>> 9) + 1980,
    (n2 & 480) >>> 5,
    n2 & 31
  ];
}

CenterBattery.prototype.getTemperature = function() {
  return this.readInt(32, 2);
}

CenterBattery.prototype.getConnStatus = function() {
  return CONN_STATUS[this.readInt(34, 1)];
}

CenterBattery.prototype.totalStudyCycle = function() {
  return this.readInt(35, 2);
}

CenterBattery.prototype.lastStudyCycle = function() {
  return this.readInt(37, 2);
}

module.exports = CenterBattery;