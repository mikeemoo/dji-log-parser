"use strict";

var DJIBuffer = require("../djibuffer");

var DEFORM_MODE = {
  0: "PACK",
  1: "PROTECT",
  2: "NORMAL",
  3: "OTHER"
};

var TRIPOD_STATUS = {
  0: "UNKNOWN",
  1: "FOLD_COMPLETE",
  2: "FOLDING",
  3: "STRETCH_COMPLETE",
  4: "STRETCHING",
  5: "STOP_DEFORMATION"
};

function Deform(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

Deform.prototype = Object.create(DJIBuffer.prototype);

Deform.prototype.getDeformMode = function() {
  return DEFORM_MODE[(this.readInt(0, 1) & 48) >>> 4]
}

Deform.prototype.getDeformStatus = function() {
  return TRIPOD_STATUS[(this.readInt(0, 1) & 14) >>> 1];
}

Deform.prototype.isDeformProtected = function() {
  return (this.readInt(0, 1) & 1) != 0;
}


module.exports = Deform;