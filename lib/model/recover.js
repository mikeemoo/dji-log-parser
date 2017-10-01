"use strict";

var DJIBuffer = require("../djibuffer");

function Recover(buffer, index, key) {
  DJIBuffer.call(this, buffer, index, key);
}

var DRONE_TYPE = {
  0: "Unknown",
  1: "Inspire",
  2: "P3S",
  3: "P3X",
  4: "P3C",
  5: "OpenFrame",
  7: "P4",
  13: "Mavic",
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
  return this.readString(5, 10);
}

Recover.prototype.getAircraftName = function() {
  return this.readString(15, 24);
}

Recover.prototype.getActiveTimestamp = function() {
  return new Date(parseInt(this.readLong(47, 8).toString())).toISOString();
}

Recover.prototype.getCameraSn = function() {
  return this.readString(55, 10);
}

Recover.prototype.getRcSn = function() {
  return this.readString(65, 10);
}

Recover.prototype.getBatterySn = function() {
  return this.readString(75, 85);
}

module.exports = Recover;
