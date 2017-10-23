"use strict";

var DJIBuffer = require("../djibuffer");

var GOHOME_STATUS = {
  0: "STANDBY",
  1: "PREASCENDING",
  2: "ALIGN",
  3: "ASCENDING",
  4: "CRUISE",
  7: "OTHER"
};

var IOC_MODE = {
  1: "CourseLock",
  2: "HomeLock",
  3: "HotspotSurround",
  100: "OTHER"
}

var MOTOR_ESCM_STATE = {
  0: "NON_SMART",
  1: "DISCONNECT",
  2: "SIGNAL_ERROR",
  3: "RESISTANCE_ERROR",
  4: "BLOCK",
  5: "NON_BALANCE",
  6: "ESCM_ERROR",
  7: "PROPELLER_OFF",
  8: "MOTOR_IDLE",
  9: "MOTOR_UP",
  10: "MOTOR_OFF",
  11: "NON_CONNECT",
  100: "OTHER"
};

function Home(buffer, index, key) {
  DJIBuffer.call(this, buffer, index, key);
}

Home.prototype = Object.create(DJIBuffer.prototype);

Home.prototype.getLongitude = function() {
  return this.readDouble(0, 8) * 180 / Math.PI;
}

Home.prototype.getLatitude = function() {
  return this.readDouble(8, 8) * 180 / Math.PI;
}

Home.prototype.getHeight = function() {
  return this.readFloat(16, 4);
}

Home.prototype.getIOCMode = function() {
  return IOC_MODE[(this.readInt(20, 2) & 57344) >>> 13];
}

Home.prototype.isIOCEnabled = function() {
  return ((this.readInt(20, 2) & 4096) >>> 12) != 0;
}

Home.prototype.isBeginnerMode = function() {
  return (this.readInt(20, 2) >> 11 & 1) != 0;
}

Home.prototype.isCompassCeleing = function() {
  return ((this.readInt(20, 2) & 1024) >>> 10) != 0;
}

Home.prototype.getCompassCeleStatus = function() {
  return (this.readInt(20, 2) & 768) >>> 8;
}

Home.prototype.hasGoHome = function() {
  return ((this.readInt(20, 2) & 128) >>> 7) != 0;
}

Home.prototype.getGoHomeStatus = function() {
  return GOHOME_STATUS[(this.readInt(20, 2) & 112) >>> 4];
}

Home.prototype.isReachLimitHeight = function() {
  return ((this.readInt(20, 2) & 32) >>> 5) != 0;
}

Home.prototype.isReachLimitDistance = function() {
  return ((this.readInt(20, 2) & 16) >>> 4) != 0;
}

Home.prototype.isDynamicHomePointEnabled = function() {
  return ((this.readInt(20, 2)  & 8) >>> 3) != 0;
}

Home.prototype.getAircraftHeadDirection = function() {
  return (this.readInt(20, 2) & 4) >>> 2;
}

Home.prototype.getGoHomeMode = function() {
  return (this.readInt(20, 2) & 2) >>> 1;
}

Home.prototype.isHomeRecord = function() {
  return (this.readInt(20, 2) & 1) != 0;
}

Home.prototype.getGoHomeHeight = function() {
  return this.readInt(22, 2);
}

Home.prototype.getCourseLockAngle = function () {
  return this.readShort(24, 2);
}

Home.prototype.getDataRecorderStatus = function() {
  return this.readInt(26, 1);
}

Home.prototype.getDataRecorderRemainCapacity = function() {
  return this.readInt(27, 1);
}

Home.prototype.getDataRecorderRemainTime = function() {
  return this.readInt(28, 2);
}

Home.prototype.getCurDataRecorderFileIndex = function() {
  return this.readInt(30, 2);
}

Home.prototype.isFlycInSimulationMode = function() {
  return (this.readInt(32, 1) & 1) != 0;
}

Home.prototype.isFlycInNavigationMode = function() {
  return ((this.readInt(32, 1) & 2) >>> 1) != 0;
}

Home.prototype.isWingBroken = function() {
  return (this.readInt(32, 1) & 4096) != 0;
}

Home.prototype.getMotorEscmState = function() {
  var state = [];
  var value = this.readInt(32, 1);
  for (var i = 0; i < 8; i++) {
    state.push(MOTOR_ESCM_STATE[(value >> (i * 4)) & 15]);
  }
}

Home.prototype.getForceLandingHeight = function() {
  return this.readInt(45, 1);
}

module.exports = Home;