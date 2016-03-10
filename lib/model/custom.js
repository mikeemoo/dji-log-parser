"use strict";

var DJIBuffer = require("../djibuffer");


function Custom(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

Custom.prototype = Object.create(DJIBuffer.prototype);

Custom.prototype.getDistance = function() {
    return this.readFloat(6,4);
};

Custom.prototype.getHSpeed = function() {
    return this.readFloat(2,4);
};

Custom.prototype.getDateTime = function() {
    return new Date(parseInt(this.readLong(10, 8).toString())).toISOString();
};

module.exports = Custom;