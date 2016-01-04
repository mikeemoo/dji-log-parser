"use strict";

var DJIBuffer = require("../djibuffer");

var DJI_BATTERY_STATUS = {
  0: "UserBatteryReqGoHome",
  1: "UserBatteryReqLand",
  4: "SmartBatteryReqGoHome",
  8: "SmartBatteryReqLand",
  16: "MainVoltageLowGoHOme",
  32: "MainVoltageLowLand",
  64: "BatteryCellError",
  128: "BatteryCommunicateError",
  256: "VoltageLowNeedLand",
  512: "BatteryTempVoltageLow",
  1024: "BatteryNotReady",
  2048: "BatteryFirstChargeNotFull",
  69905: "OTHER"
};

function SmartBattery(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

SmartBattery.prototype = Object.create(DJIBuffer.prototype);

SmartBattery.prototype.getUsefulTime = function() {
  return this.readInt(0, 2);
}

SmartBattery.prototype.getGoHomeTime = function() {
  return this.readInt(2, 2);
}

SmartBattery.prototype.getLandTime = function() {
  return this.readInt(4, 2);
}

SmartBattery.prototype.getGoHomeBattery = function() {
  return this.readInt(6, 2);
}

SmartBattery.prototype.getLandBattery = function() {
  return this.readInt(8, 2);
}

SmartBattery.prototype.getSafeFlyRadius = function() {
  return this.readFloat(10, 4);
}

SmartBattery.prototype.getVolumeConsume = function() {
  return this.readFloat(14, 4);
}

SmartBattery.prototype.getStatus = function() {
  return DJI_BATTERY_STATUS[this.readInt(18, 4)];
}

SmartBattery.prototype.getGoHomeStatus = function() {
  return this.readInt(22, 1);
}

SmartBattery.prototype.getGoHomeCountDown = function() {
  return this.readInt(23, 1);
}

SmartBattery.prototype.getVoltage = function() {
  return this.readInt(24, 2);
}

//SmartBattery.prototype.getBattery

SmartBattery.prototype.getLowWarning = function() {
  return this.readInt(27, 1) & 127;
}

SmartBattery.prototype.getLowWarningGoHome = function() {
  return (this.readInt(27, 1) & 128) != 0;
}

SmartBattery.prototype.getSeriousLowWarning = function() {
  return this.readInt(28, 1) & 127;
}

SmartBattery.prototype.getSeriousLowWarningLanding = function() {
  return (this.readInt(28, 1) & 128) != 0;
}

SmartBattery.prototype.getVoltagePercent = function() {
  return this.readInt(29, 1);
}

module.exports = SmartBattery;