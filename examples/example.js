var DJIParser = require("../index");
var fs = require("fs");

var parser = new DJIParser();
var imageIndex = 1;

parser.on("OSD", function(obj) {
  console.log(obj.getHeight());
});

parser.on("IMAGE", function(obj) {
  fs.writeFileSync("image"+(imageIndex++)+".jpg", obj.buffer, "binary");
});

parser.parse(fs.readFileSync("DJIFlightRecord_2015-12-29_[19-05-48].txt"));