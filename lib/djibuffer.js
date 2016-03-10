"use strict";

var ByteBuffer = require("bytebuffer");
var tmpBuffer = new ByteBuffer(32, true);

function DJIBuffer(buffer, index) {
  this.buffer = buffer;
  this.index = 0;
}

DJIBuffer.prototype.clearAndCopy = function(offset, length) {
  tmpBuffer.fill(0, 0, tmpBuffer.length);
  this.buffer.copyTo(tmpBuffer, 0, this.index + offset, this.index + offset + length);
  return tmpBuffer;
}

DJIBuffer.prototype.readDouble = function(offset, length) {
  return this.clearAndCopy(offset, length).readDouble(0);
}

DJIBuffer.prototype.readFloat = function(offset, length) {
  return this.clearAndCopy(offset, length).readFloat(0);
}

DJIBuffer.prototype.readByte = function(offset) {
  return this.buffer.readUint8(this.index + offset);
}

DJIBuffer.prototype.readInt = function(offset, length) {
  return this.clearAndCopy(offset, length).readInt32(0);
}

DJIBuffer.prototype.readShort = function(offset, length) {
  return this.clearAndCopy(offset, length).readInt16(0);
}

DJIBuffer.prototype.readLong = function(offset, length) {
  return this.clearAndCopy(offset, length).readLong(0);
}

DJIBuffer.prototype.length = function() {
  return this.buffer.length;
}

module.exports = DJIBuffer;