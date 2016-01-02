var DJIParser = require("../index");

var parser = new DJIParser();

parser.on("OSD", function(obj) {
  console.log(obj.getFlyTime(), obj.getLatitude(), obj.getLongitude());
});

parser.on("APP_TIP", function(obj) {
  console.log(obj.getMessage());
})

parser.parseFile("DJIFlightRecord_2015-12-29_[19-05-48].txt");