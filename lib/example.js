const fs = require("fs");

var bitmap = fs.readFile(__dirname + "/" + process.argv[2]);
var bitmapData = {};

bitmapData.headField = bitmap.toString("ascii", 0, 2);
bitmapData.size = bitmap.readUInt32LE(2);
bitmapData.pixelArrayStart = bitmap.readUInt32LE(10);
bitmapData.paletteColors = bitmap.readUInt32LE(46);

console.log("first color: " + bitmap[54]);
console.dir(bitmapData);

// Each pixel in palette is 1 byte, palette colors stored in color table,
// stored right after header, pixel points to color table
// Each pixel in non-palette is 4 bytes (1 byte each for RGBA), color stored in each pixel
// First header is 14 bytes
// Second header is 40 bytes
// Pixel array data starts at index 54, where you start manipulating colors
// fs.writeFile can take buffer data directly and write to new file
// buf.write to modify buffer data
// Convert buffer to hex strings to work with colors or reference the pixel index,
// but color order may be messed up
// Have your transform function only operate on a single color/RGBA value
