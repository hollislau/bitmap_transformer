const expect = require("chai").expect;
const fs = require("fs");
const BmTransformer = require(__dirname + "/../lib/bm_trans.js");

describe("bitmap transformer", () => {
  var bmTransformer = new BmTransformer();
  var bitmap = fs.readFileSync(__dirname + "/non-palette-bitmap.bmp");
  bmTransformer.setBmInfo(bitmap);

  it("sets non-palette bitmap header info correctly", () => {
    expect(bmTransformer.bitmapData.headerField).to.eql("BM");
    expect(bmTransformer.bitmapData.pixelArrayStart).to.eql(54);
    expect(bmTransformer.bitmapData.bitsPerPixel).to.eql(24);
    expect(bmTransformer.bitmapData.rawBmSize).to.eql(30000);
    expect(bmTransformer.bitmapData.paletteColors).to.eql(0);
  });

  it("properly applies inversion to non-palette bitmaps", () => {
    var bitmapCopy = fs.readFileSync(__dirname + "/non-palette-bitmap.bmp");
    var inverted = bmTransformer.inverted(bitmapCopy);
    expect(inverted[3000]).to.eql(255 - bitmap[3000]);
  });

  it("properly applies grayscale to non-palette bitmaps", () => {
    var bitmapCopy = fs.readFileSync(__dirname + "/non-palette-bitmap.bmp");
    var grayscale = bmTransformer.grayscale(bitmapCopy);
    var colorAvg = function (bm, index) {
      return (bm[index] + bm[index + 1] + bm[index + 2]) / 3;
    };
    expect(grayscale[3054]).to.eql(colorAvg(bitmap, 3054));
  });
});
