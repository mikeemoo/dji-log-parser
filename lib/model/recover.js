"use strict";

var DJIBuffer = require("../djibuffer");

function Recover(buffer, index) {
	this.buffer = buffer;
	this.index = index;
}

Recover.prototype = Object.create(DJIBuffer.prototype);

Recover.prototype.rcSerial = function() {
  return this.buffer.toString("utf8", this.index + 65, this.index+75);
}

Recover.prototype.droneSerial = function() {
  return this.buffer.toString("utf8", this.index + 5, this.index+15);
}

Recover.prototype.droneName = function() {
  return this.buffer.toString("utf8", this.index + 15, this.index+47);
}

Recover.prototype.appVersion = function() {
  return this.readByte(2)+'.'+this.readByte(3)+'.'+this.readByte(4);
}

module.exports = Recover;