const fs = require('fs');
const path = require('path');
const Struct = require('../../index');

const headerStruct = new Struct(
  Struct.Uint16('signature'),
  Struct.Uint32('fileSize'),
  Struct.Uint32('unused'),
  Struct.Uint32('bitmapDataStart')
);

const infoHeaderStruct = new Struct(
  Struct.Uint32('sizeOfInfoHeader'),
  Struct.Uint32('imageWidth'),
  Struct.Uint32('imageHeight'),
  Struct.Uint16('planes'),
  Struct.Uint16('bitsPerPixel'),
  Struct.Uint32('compression'),
  Struct.Uint32('bitmapDataSize'),
  Struct.Uint32('xPixelsPerMeter'),
  Struct.Uint32('yPixelsPerMeter'),
  Struct.Uint32('numberOfColors'),
  Struct.Uint32('importantColors')
);

const pixelDataStruct = new Struct(
  Struct.Uint8('blue'),
  Struct.Uint8('green'),
  Struct.Uint8('red')
);

// Read file, log info about it, then turn every other pixel blue and write new file
fs.readFile(path.join(__dirname, 'cartest.bmp'), (err, data) => {
  const header = headerStruct.getObject(data.buffer, 0, true);
  const infoHeader = infoHeaderStruct.getObject(data.buffer, header.byteLength, true);
  const pixels = pixelDataStruct.getObjects(data.buffer, header.bitmapDataStart, infoHeader.imageWidth * infoHeader.imageHeight, true);

  console.log(`Image Size: ${infoHeader.imageWidth} x ${infoHeader.imageHeight}`);
  console.log(`Bits Per Pixel: ${infoHeader.bitsPerPixel}`);
  console.log(`Image size in bytes (width * height * bytes per pixel): ${infoHeader.bitmapDataSize}`);

  pixels.forEach((pixel, index) => {
    if (index % 2 === 0) {
      pixel.red = 0;
      pixel.green = 0;
      pixel.blue = 255;
    }
  });

  fs.writeFile(path.join(__dirname, 'blue-pixels.bmp'), data, (error) => error ? console.log(error) : null);
});