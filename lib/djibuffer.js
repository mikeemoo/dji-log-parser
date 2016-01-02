var tmpBuffer = new Buffer(32);

function DJIBuffer(buffer, index) {
  this.buffer = buffer;
  this.index = 0;
}

DJIBuffer.prototype.clearAndCopy = function(offset, length) {
  tmpBuffer.fill(0);
  for (var i = 0; i < length; i++) {
    tmpBuffer[i] = this.buffer[this.index + offset + i];
  }
  return tmpBuffer;
}

DJIBuffer.prototype.readDouble = function(offset, length) {
  return this.clearAndCopy(offset, length).readDoubleLE(0);
}

DJIBuffer.prototype.readFloat = function(offset, length) {
  return this.clearAndCopy(offset, length).readFloatLE(0);
}

DJIBuffer.prototype.readByte = function(offset) {
  return this.buffer[this.index + offset];
}

DJIBuffer.prototype.readInt = function(offset, length) {
  return this.clearAndCopy(offset, length).readInt32LE(0);
}

DJIBuffer.prototype.readShort = function(offset, length) {
  return this.clearAndCopy(offset, length).readInt16LE(0);
}

DJIBuffer.prototype.length = function() {
  return this.buffer.length;
}

module.exports = DJIBuffer;