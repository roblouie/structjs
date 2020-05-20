# StructJS

Struct makes it easy to both read and modify ANY file of ANY type, provided you know how that file is **struct**ured.

StructJS provides a C style struct type making reading and editing binary files easier. It's also small (6kb minified) and has no external dependencies.

## Installation

Install the package:

`npm install @rlouie/structjs`

## Usage

For an example, let's write a program that reads in a bitmap image file. Using [information about the files format](http://www.ece.ualberta.ca/~elliott/ee552/studentAppNotes/2003_w/misc/bmp_file_format/bmp_file_format.htm) we know that the file header should look like this:

### Bitmap File Header

| Size | Description |
|---------|----------|
| 2 bytes | File signature |
| 4 bytes | File size in bytes |
| 4 bytes | Unused |
| 4 bytes | Defines the offset from the start of the file to where the actual bitmap pixel image data is stored |

If we open a bitmap image file into an ArrayBuffer using a FileReader, StructJS makes it easy to read this data out of the ArrayBuffer and into a nicely defined object. First we get an array buffer and define our struct based on the header structure:
```js
import Struct from '@rlouie/structjs'

const bitmapFileArrayBuffer = readBitmapImageFile();

const bitmapHeaderStruct = new Struct(
  Struct.Uint16('signature'),
  Struct.Uint32('fileSize'),
  Struct.Uint32('unused'),
  Struct.Uint32('bitmapDataStart')
);
```

We then call `getObject` on our struct to read data out of the array buffer into our object. We pass in the buffer to read from, the byte index to start from, and true for little endian.
```js
const bitmapHeader = bitmapHeaderStruct.getObject(bitmapFileArrayBuffer, 0, true);

console.log(bitmpHeader.fileSize);
```
And that's it. This code will log the bitmap file size to the console using the data read from the file header.

We can actually continue on with this and define out the rest of the file based on the documented structure.
```js
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

const infoHeader = infoHeaderStruct.getObject(bitmapFileArrayBuffer, header.byteLength, true);
const numberOfPixels = infoHeader.imageWidth * infoHeader.imageHeight;
```
After defining our structs, we generate the info header object as before, but now we want to start after the header, so we give a starting point of the byte length of the header. We also calculate how many pixels total are in the image by multiplying the width and height.

Now with pixels, unlike the headers, we actually need an array of pixels, not just one. So we call `getObjects` on our struct to get an array of objects built from our struct, starting at the beginning of the bitmap data, and reading number of pixels times, in little endian format. The result will be an array the size of umberOfPixels, where each element of the array is an object defined by our struct.
```js
const pixels = pixelDataStruct.getObjects(bitmapFile, header.bitmapDataStart, numberOfPixels, true);
```
And believe it or not, that's it! We just read in an entire bitmap image file exactly to spec. We can draw the image into a canvas now if we want to with just a little extra code.

```js
const imageData = new ImageData(infoHeader.imageWidth, infoHeader.imageHeight);

pixels.forEach((pixel, index) => {
  const imageDataIndex = index * 4;
  imageData.data[imageDataIndex] = pixel.red;
  imageData.data[imageDataIndex + 1] = pixel.green;
  imageData.data[imageDataIndex + 2] = pixel.blue;
  imageData.data[imageDataIndex + 3] = 255; // Solid opacity
});

canvasContext.putImageData(imageData, 0, 0);
```
Great! We read in a bitmap image file and drew it to the canvas. But that's not all, the properties of the generated objects are **not** read only, **you can modify the file by modifying the properties**. For instance we can turn every other pixel in the bitmap image file blue by modifying the pixels.
```js
pixels.forEach((pixel, index) => {
  if (index % 2 === 0) {
    pixel.red = 0;
    pixel.green = 0;
    pixel.blue = 255;
  }
});
```
This doesn't just modify your pixel objects, each pixel is tied directly to your binary data. Changing a property of the pixel object actually changes the data in the array buffer. If you download the original ArrayBuffer every other pixel will be blue. You can try this out [here](https://roblouie.com/structjs/bitmap-example/), or view the full code [here](https://github.com/roblouie/structjs/front-end).

### Usage in Node

StructJS can be used in node just as on the front-end, just use require instead of import:

```js
const Struct = require('@rlouie/structjs');
```

And use the `.buffer` property of the `Buffer` object returned by `fs.readfile`:
```js
fs.readFile(path.join(__dirname, 'cartest.bmp'), (err, data) => {
  const header = headerStruct.getObject(data.buffer, 0, true);
  const infoHeader = infoHeaderStruct.getObject(data.buffer, header.byteLength, true);
  const numberOfPixels = infoHeader.imageWidth * infoHeader.imageHeight;
  const pixels = pixelDataStruct.getObjects(data.buffer, header.bitmapDataStart, numberOfPixels, true);

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

  fs.writeFile(path.join(__dirname, 'blue-pixels.bmp'), data, () => console.log('File written'));
});
```
I've omitted redefining the Structs here, see the front-end section for that, or the full example code [here](https://github.com/roblouie/structjs/examples/node/open-bitmap.js).

## API

### Static

#### Struct(propertyInfo1, ...propertyInfoN)
Creates a new Struct.
#####  Parameters
`propertyInfo1, propertyInfo2, propertyInfoN`

One or more property definitions for your struct.
##### Returns
A Struct instance based on the definitions provided.

#### Struct.Int8(propertyName)
Defines 8-bit signed integer.
#####  Parameters
`propertyName`

What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Int8', byteLength: 1 }` used by the `Struct` constructor.

### Struct.Uint8(propertyName)
Defines 8-bit unsigned integer.
####  Parameters
`propertyName`

What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Uint8', byteLength: 1 }` used by the `Struct` constructor.

### Struct.Int16(propertyName)
Defines 16-bit signed integer.
####  Parameters
`propertyName`

What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Int16', byteLength: 2 }` used by the `Struct` constructor.

### Struct.Uint16(propertyName)
Defines 16-bit unsigned integer.
####  Parameters
`propertyName`

What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Uint16', byteLength: 2 }` used by the `Struct` constructor.

### Struct.Int32(propertyName)
Defines 32-bit signed integer.
####  Parameters
`propertyName`

What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Int32', byteLength: 4 }` used by the `Struct` constructor.

### Struct.Uint32(propertyName)
Defines 32-bit unsigned integer.
####  Parameters
`propertyName`

What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Uint32', byteLength: 4 }` used by the `Struct` constructor.

### Struct.BigInt64(propertyName)
Defines 64-bit signed big int.
####  Parameters
`propertyName`

What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'BigInt64', byteLength: 8 }` used by the `Struct` constructor.

### Struct.BigUint64(propertyName)
Defines 64-bit unsigned big int.
####  Parameters
`propertyName`

What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'BigUint64', byteLength: 8 }` used by the `Struct` constructor.

### Struct.Float32(propertyName)
Defines 32-bit floating point number.
####  Parameters
`propertyName`

What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Float32', byteLength: 4 }` used by the `Struct` constructor.

### Struct.Float64(propertyName)
Defines 64-bit floating point number.
####  Parameters
`propertyName`

What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Float64', byteLength: 8 }` used by the `Struct` constructor.
