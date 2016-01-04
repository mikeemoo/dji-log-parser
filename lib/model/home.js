"use strict";

var DJIBuffer = require("../djibuffer");

function Home(buffer, index) {
  this.buffer = buffer;
  this.index = index;
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
  return (this.readInt(20, 2) & 57344) >>> 13;
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
  return (this.readInt(20, 2) & 112) >>> 4;
}

//Home.prototype.isMultipleModeOpen = function() {

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

Home.prototype.getDataRecorderStatus = function() {
  return this.readInt(26, 1);
}

Home.prototype.getDataRecorderPercent = function() {
  return this.readInt(27, 1);
}

Home.prototype.getDataRecorderLeftTime = function() {
  return this.readInt(28, 2);
}

Home.prototype.getDataRecorderCurrentIndex = function() {
  return this.readInt(30, 2);
}

Home.prototype.getSimulatorOpen = function() {
  return (this.readInt(32, 1) & 1) != 0;
}

Home.prototype.getNavigationOpen = function() {
  return ((this.readInt(32, 1) & 2) >>> 1) != 0;
}

module.exports = Home;