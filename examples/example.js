var DJIParser = require("../index");
var fs = require("fs");

var parser = new DJIParser();

parser.on("OSD", function(obj) {
  console.log(obj.getHeight());
});

parser.parse(fs.readFileSync("DJIFlightRecord_2015-12-29_[19-05-48].txt"));