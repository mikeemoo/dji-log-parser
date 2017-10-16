"use strict";

var ByteBuffer = require("bytebuffer");
var tmpBuffer = new ByteBuffer(32, true);

function DJIBuffer(buffer, index, key) {
  this.buffer = buffer;
  this.index = index;
  this.key = key || [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0];
}

DJIBuffer.prototype.clearCopyAndDecode = function(offset, length) {
  tmpBuffer.fill(0, 0, tmpBuffer.length);
  this.buffer.copyTo(tmpBuffer, 0, this.index + offset, this.index + offset + length);
  for(var i=0; i<length; i++) {
    var decodedByte = tmpBuffer.readUint8(i) ^ this.key[(offset + i) % 8];
    tmpBuffer.writeUint8(decodedByte, i);
  }
  return tmpBuffer;
}

DJIBuffer.prototype.readDouble = function(offset, length) {
  return this.clearCopyAndDecode(offset, length).readDouble(0);
}

DJIBuffer.prototype.readFloat = function(offset, length) {
  return this.clearCopyAndDecode(offset, length).readFloat(0);
}

DJIBuffer.prototype.readByte = function(offset) {
  return this.clearCopyAndDecode(offset, 1).readUint8(0);
}

DJIBuffer.prototype.readInt = function(offset, length) {
  return this.clearCopyAndDecode(offset, length).readInt32(0);
}

DJIBuffer.prototype.readShort = function(offset, length) {
  return this.clearCopyAndDecode(offset, length).readInt16(0);
}

DJIBuffer.prototype.readLong = function(offset, length) {
  return this.clearCopyAndDecode(offset, length).readLong(0);
}

DJIBuffer.prototype.readString = function(offset, length) {
  return this.clearCopyAndDecode(offset, length).toString("utf8", 0, length);
}

DJIBuffer.prototype.length = function() {
  return this.buffer.length;
}

module.exports = DJIBuffer;