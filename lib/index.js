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
      break;
    }

    var data = null;

    switch (type) {
      case "OSD":
        data = new OSD(buffer, offset);
        break;
      case "DEFORM":
        data = new Deform(buffer, offset);
        break;
      case "SMART_BATTERY":
        data = new SmartBattery(buffer, offset);
        break;
      case "GIMBAL":
        data = new Gimbal(buffer, offset);
        break;
      case "RC":
        data = new RC(buffer, offset);
        break;
      case "CUSTOM":
        data = new Custom(buffer, offset);
        break;
      case "RC_GPS":
        data = new RCGPS(buffer, offset);
        break;
      case "CENTER_BATTERY":
        data = new CenterBattery(buffer, offset);
        break;
      case "HOME":
        data = new Home(buffer, offset);
        break;
      case "RECOVER":
        data = new Recover(buffer, offset, length);
        break;
      case "APP_TIP":
      case "APP_WARN":
        data = new AppMessage(buffer, offset, length);
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
