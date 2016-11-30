"use strict";

var DJIBuffer = require("../djibuffer");

var APP_TYPE = {
  0: "UNKNOWN",
  1: "IOS",
  2: "ANDROID"
};

function Details(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

Details.prototype = Object.create(DJIBuffer.prototype);

Details.prototype.getSubStreet = function() {
  return this.buffer.toString("utf8", this.index, this.index+20);
}

Details.prototype.getStreet = function() {
  return this.buffer.toString("utf8", this.index+20, this.index+40);
}

Details.prototype.getCity = function() {
  return this.buffer.toString("utf8", this.index+40, this.index+60);
}

Details.prototype.getArea = function() {
  return this.buffer.toString("utf8", this.index+60, this.index+80);
}

Details.prototype.isFavorite = function() {
  return (this.readInt(80, 1) & 1) != 0;
}

Details.prototype.isNew = function() {
  return (this.readInt(81, 1) & 1) != 0;
}

Details.prototype.needsUpload = function() {
  return (this.readInt(82, 1) & 1) != 0;
}

Details.prototype.getRecordLineCount = function() {
  return this.readInt(83, 4);
}

Details.prototype.getUpdateTime = function() {
  return new Date(parseInt(this.readLong(91, 8).toString())).toISOString();
}

Details.prototype.getLongitude = function() {
  return this.readDouble(99, 8);
}

Details.prototype.getLatitude = function() {
  return this.readDouble(107, 8);
}

Details.prototype.getTotalDistance = function() {
  return this.readFloat(115, 4);
}

Details.prototype.getTotalTime = function() {
  return this.readInt(119, 4);
}

Details.prototype.getMaxHeight = function() {
  return this.readFloat(123, 4);
}

Details.prototype.getMaxHSpeed = function() {
  return this.readFloat(127, 4);
}

Details.prototype.getMaxVSpeed = function() {
  return this.readFloat(131, 4);
}

Details.prototype.getPhotoNum = function() {
  return this.readInt(135, 4);
}

Details.prototype.getVideoTime = function() {
  return this.readInt(139, 4);
}

Details.prototype.getAircraftSn = function() {
  return this.buffer.toString("utf8", this.index+267, this.index+277);
}

Details.prototype.getAircraftName = function() {
  return this.buffer.toString("utf8", this.index+278, this.index+302);
}

Details.prototype.getActiveTimestamp = function() {
  return new Date(parseInt(this.readLong(310, 8).toString())).toISOString();
}

Details.prototype.getCameraSn = function() {
  return this.buffer.toString("utf8", this.index+318, this.index+328);
}

Details.prototype.getRcSn = function() {
  return this.buffer.toString("utf8", this.index+328, this.index+338);
}

Details.prototype.getBatterySn = function() {
  return this.buffer.toString("utf8", this.index+338, this.index+348);
}

Details.prototype.getAppType = function() {
  return APP_TYPE[this.readInt(348, 1)];
}

Details.prototype.getAppVersion = function() {
  return this.readInt(349, 1)+'.'+this.readInt(350, 1)+'.'+this.readInt(351, 1);
}

module.exports = Details;
