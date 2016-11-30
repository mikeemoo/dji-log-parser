"use strict";

var DJIBuffer = require("../djibuffer");

function Recover(buffer, index) {
	this.buffer = buffer;
	this.index = index;
}

var DRONE_TYPE = {
  0: "Unknown",
  1: "Inspire",
  2: "P3S",
  3: "P3X",
  4: "P3C",
  5: "OpenFrame",
  100: "None"
};

var APP_TYPE = {
  0: "UNKNOWN",
  1: "IOS",
  2: "ANDROID"
};

Recover.prototype = Object.create(DJIBuffer.prototype);

Recover.prototype.getDroneType = function() {
  return DRONE_TYPE[this.readInt(0, 1)];
}

Recover.prototype.getAppType = function() {
  return APP_TYPE[this.readInt(1, 1)];
}

Recover.prototype.getAppVersion = function() {
  return this.readInt(2, 1)+'.'+this.readInt(3, 1)+'.'+this.readInt(4, 1);
}

Recover.prototype.getAircraftSn = function() {
  return this.buffer.toString("utf8", this.index+5, this.index+15);
}

Recover.prototype.getAircraftName = function() {
  return this.buffer.toString("utf8", this.index+15, this.index+39);
}

Recover.prototype.getActiveTimestamp = function() {
  return new Date(parseInt(this.readLong(47, 8).toString())).toISOString();
}

Recover.prototype.getCameraSn = function() {
  return this.buffer.toString("utf8", this.index+55, this.index+65);
}

Recover.prototype.getRcSn = function() {
  return this.buffer.toString("utf8", this.index+65, this.index+75);
}

Recover.prototype.getBatterySn = function() {
  return this.buffer.toString("utf8", this.index+75, this.index+85);
}

module.exports = Recover;
