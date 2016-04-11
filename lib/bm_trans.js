const EE = require("events");
const fs = require("fs");

const BmTransformer = module.exports = exports = function () {
  this.ee = new EE();
  this.bitmap = __dirname + "/" + process.argv[2];
  this.transform = process.argv[3];
  this.bitmapData = {};

  this.ee.on("read", (data, transform) => {
    var transformedData;

    this.bitmapData.headerField = data.toString("ascii", 0, 2);
    this.bitmapData.bmSize = data.readUInt32LE(2);
    this.bitmapData.pixelArrayStart = data.readUInt32LE(10);
    this.bitmapData.bmWidth = data.readUInt32LE(18);
    this.bitmapData.bmHeight = data.readUInt32LE(22);
    this.bitmapData.bitsPerPixel = data.readUInt32LE(28);
    this.bitmapData.rawBmSize = data.readUInt32LE(34);
    this.bitmapData.paletteColors = data.readUInt32LE(46);

    console.dir(this.bitmapData);
    transformedData = this[transform](data);

    fs.writeFile(__dirname + "/transformed/" + transform + "-" + process.argv[2], transformedData, (err) => {
      if (err) {
        return process.stderr.write(err);
      }
      console.log(transform + " bitmap saved!");
    });
  });
};

BmTransformer.prototype.start = function () {
  fs.readFile(this.bitmap, (err, data) => {
    if (err) {
      return process.stderr.write(err);
    }
    this.ee.emit("read", data, this.transform);
  });
};

BmTransformer.prototype.grayscale = function (data) {
  var avg;

  for (var i = this.bitmapData.pixelArrayStart; i <= this.bitmapData.rawBmSize; i += 3) {
    avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
  return data;
};

BmTransformer.prototype.inverted = function (data) {
  for (var i = this.bitmapData.pixelArrayStart; i <= this.bitmapData.rawBmSize; i++) {
    data[i] = 255 - data[i];
  }
  return data;
};

var bmTransformer = new BmTransformer();
bmTransformer.start();
