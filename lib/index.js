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
  255: "END",
  254: "OTHER"
};

function DJIParser() {
  this.lastMessages = {};
  this.encrypted = false;
}

DJIParser.prototype = Object.create(EventEmitter.prototype);

DJIParser.prototype.getLast = function(type) {
  return this.lastMessages[type];
}

DJIParser.prototype.parse = function(buffer) {

  buffer = ByteBuffer.wrap(buffer, "binary", true);

  // first 3 header bytes show address, where Details section starts
  var detailsOffset = buffer.readInt(0,3);

  // these are related to bitmaps, which are stored at the end of the file
  //buffer.readInt16LE(8);
  //buffer.readInt16LE(10);

  // packets start at offset 12
  var offset = 12;

  // parse records are located before Details section
  while (offset < detailsOffset) {

    // first byte of a packet is 'type'
    var tId = buffer.readUint8(offset++);
    var type = types[tId];

    // second byte is packet length
    var length = buffer.readUint8(offset++);

    var end = buffer.readUint8(offset + length);

    if (end != 0xFF) {
      offset += length + 1;
      continue;
    }

    // guess if frame is encrypted using some known length
    if (!this.encrypted) {
      if (
        (tId == 1 && length > 50) ||
        (tId == 3 && length > 12) ||
        (tId == 4 && length > 13) ||
        (tId == 5 && length > 18)
      ) {
        this.encrypted = true;
      }
    }

    var key;
    var dataOffset = offset;
    var dataLength = length;

    // Get key if frame is encrypted
    if (this.encrypted) {
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

    offset += length + 1;
  }

  // parse Details
  this.emit('DETAILS', new Details(buffer, detailsOffset));

}

if (typeof window != "undefined") {
  window.DJIParser = DJIParser;
}

module.exports = DJIParser;
