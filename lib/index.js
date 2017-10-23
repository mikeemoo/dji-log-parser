"use strict";

var EventEmitter = require("events").EventEmitter;
var ByteBuffer = require("bytebuffer");

var OSD = require("./model/osd");
var RC = require("./model/rc");
var RCGPS = require("./model/rc-gps");
var Deform = require("./model/deform");
var Gimbal = require("./model/gimbal");
var AppMessage = require("./model/app-message");
var SmartBattery = require("./model/smart-battery");
var CenterBattery = require("./model/center-battery");
var Custom = require("./model/custom");
var Home = require("./model/home");
var Recover = require("./model/recover");
var Details = require("./model/details");
var AppGPS = require("./model/app-gps");

var keys = require("./keys");

var types = {
  1: "OSD",
  2: "HOME",
  3: "GIMBAL",
  4: "RC",
  5: "CUSTOM",
  6: "DEFORM",
  7: "CENTER_BATTERY",
  8: "SMART_BATTERY",
  9: "APP_TIP",
  10: "APP_WARN",
  11: "RC_GPS",
  12: "RC_DEBUG",
  13: "RECOVER",
  14: "APP_GPS",
  15: "FIRMWARE",
  16: "OFDM_DEBUG",
  17: "VISION_GROUP",
  18: "VISION_WARN",
  19: "MC_PARAM",
  20: "APP_OPERATION",
  255: "END",
  254: "OTHER"
};

function DJIParser() {
  this.lastMessages = {};
}

DJIParser.prototype = Object.create(EventEmitter.prototype);

DJIParser.prototype.getLast = function(type) {
  return this.lastMessages[type];
}

DJIParser.prototype.parse = function(buffer) {
  // reset messages
  this.lastMessages = {};
  // wrap buffer
  var buffer = ByteBuffer.wrap(buffer, "binary", true);
  // first 3 header bytes show address, where Details section starts
  var detailsOffset = buffer.readInt(0,3);
  // guess if frames are encrypted
  var isEncrypted = buffer.readUint8(10) > 6;
  // packets start at offset 12
  var offset = 12;

  // parse records are located before Details section
  while (offset < (detailsOffset || buffer.limit - 4)) {

    if (this.isFrame(buffer, offset)) {
      offset = this.extractFrame(buffer, offset, isEncrypted);
      continue;
    }
    
    if (this.isImage(buffer, offset)) {
      offset = this.extractImage(buffer, offset);
      continue;
    }
    offset++;
  }

  // parse Details
  if (detailsOffset > 0) {
    this.emit('DETAILS', new Details(buffer, detailsOffset));
  }
}

DJIParser.prototype.isFrame = function(buffer, offset) {
  var tId = buffer.readUint8(offset++);
  var length = buffer.readUint8(offset++);
  if (offset + length > buffer.limit - 1) {
    return false;
  }
  
  var end = buffer.readUint8(offset + length);
  return tId != 0 && end == 0xFF;
}

DJIParser.prototype.isImage = function(buffer, offset) {
  var header = buffer.readUInt32(offset);
  return header == 3774863615; // JFIF header 0xFF 0xD8 0xFF 0xE0
}

DJIParser.prototype.extractFrame = function(buffer, offset, isEncrypted) {
  // first byte of a packet is 'type'
  var tId = buffer.readUint8(offset++);
  var type = types[tId];

  // second byte is packet length
  var length = buffer.readUint8(offset++);

  var key;
  var dataOffset = offset;
  var dataLength = length;

  // Get key if frame is encrypted
  if (isEncrypted) {
    var byteKey = buffer.readUint8(offset);
    key = keys[((tId - 1) * 256) + byteKey];
    dataOffset ++;
    dataLength -= 2;
  }

  var data = null;

  switch (type) {
    case "OSD":
      data = new OSD(buffer, dataOffset, key);
      break;
    case "DEFORM":
      data = new Deform(buffer, dataOffset, key);
      break;
    case "SMART_BATTERY":
      data = new SmartBattery(buffer, dataOffset, key);
      break;
    case "GIMBAL":
      data = new Gimbal(buffer, dataOffset, key);
      break;
    case "RC":
      data = new RC(buffer, dataOffset, key);
      break;
    case "CUSTOM":
      data = new Custom(buffer, dataOffset, key);
      break;
    case "RC_GPS":
      data = new RCGPS(buffer, dataOffset, key);
      break;
    case "CENTER_BATTERY":
      data = new CenterBattery(buffer, dataOffset, key);
      break;
    case "HOME":
      data = new Home(buffer, dataOffset, key);
      break;
    case "RECOVER":
      data = new Recover(buffer, dataOffset, key);
      break;
    case "APP_TIP":
    case "APP_WARN":
      data = new AppMessage(buffer, dataOffset, dataLength, key);
      break;
    case "APP_GPS":
      data = new AppGPS(buffer, dataOffset, key);
      break;
  }

  if (data !== null) {
    this.emit(type, data);
    this.lastMessages[type] = data;
  }

  return offset + length + 1;
}

DJIParser.prototype.extractImage = function(buffer, offset) {
  for (var endOffset = offset; endOffset < buffer.limit; endOffset++) {
    if (buffer.readUint16(endOffset) == 55807) { // End JFIF marker 0xFF 0xD9
      this.emit("IMAGE", buffer.copy(offset, endOffset + 2));
      break;
    }
  }
  return endOffset + 2;
}

if (typeof window != "undefined") {
  window.DJIParser = DJIParser;
}

module.exports = DJIParser;
