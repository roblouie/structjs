# StructJS
![Code Coverage](https://img.shields.io/endpoint?style=flat-square&url=https%3A%2F%2Ftest-coverage-badge-smi3nzhw5v75.runkit.sh%3Fstop1%3Dcache)
![Minzipped Size](https://img.shields.io/bundlephobia/minzip/@rlouie/structjs?style=flat-square)

Struct makes it easy to both read and modify any file of any type, provided you know how that file is **struct**ured.

StructJS provides a C style struct interface making reading and editing binary files simple and more self-documenting. StructJS is built with simplicity in mind, is **tiny**, and has **zero dependencies**.

* [Installation](#installation)
* [Usage](#usage)
* [How it Works](#how-it-works)
* [API](#api)

## Installation

Install the package:

`npm install @binary-files/structjs`

## Usage

As an example, let's write a program that reads in a bitmap image file, displays information about it, then modifies the image. Using [information about the file format](http://www.ece.ualberta.ca/~elliott/ee552/studentAppNotes/2003_w/misc/bmp_file_format/bmp_file_format.htm) we know that the file header should look like this:

#### Bitmap File Header

| Size | Description |
|---------|----------|
| 2 bytes | File signature |
| 4 bytes | File size in bytes |
| 4 bytes | Unused |
| 4 bytes | Defines the offset from the start of the file to where the actual bitmap pixel image data is stored |

Lets define our struct based the header structure:
```js
import { Struct } from '@binary-files/structjs';

const bitmapHeaderStruct = new Struct(
  Struct.Uint16('signature'),
  Struct.Uint32('fileSize'),
  Struct.Skip(4), // Skip 4 bytes for unused section
  Struct.Uint32('bitmapDataStart')
);
```
Each property is defined with it's own type based on the file structure. Now let's read a bitmap file into an `ArrayBuffer` and call `createObject` on our struct to read data out of the `ArrayBuffer` into our object. We pass in the `ArrayBuffer` to read from, the byte index in the file to start from, and true for little endian. In this case the byte offset is zero since we want to start from the beginning of the file.
```js
const bitmapFileArrayBuffer = readBitmapImageFile();

const bitmapHeader = bitmapHeaderStruct.createObject(bitmapFileArrayBuffer, 0, true);

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

const infoHeader = infoHeaderStruct.createObject(bitmapFileArrayBuffer, header.byteLength, true);
const numberOfPixels = infoHeader.imageWidth * infoHeader.imageHeight;
```
After defining our structs, we generate the info header object as before, but now we want to start after the header, so we give a starting point of the byte length of the header. We also calculate how many pixels total are in the image by multiplying the width and height.

For pixels, unlike the headers, we actually need an array of pixels instead of just one. So we call `createArray` on our struct to get an array of objects built from our struct, starting at the beginning of the bitmap data, and reading number of pixels times, in little endian format. The result will be an array the size of numberOfPixels, where each element of the array is an object defined by our struct.
```js
const pixels = pixelDataStruct.createArray(bitmapFile, header.bitmapDataStart, numberOfPixels, true);
```
And believe it or not, that's it! We can now read in entire bitmap image files exactly to spec. We can draw the image into a canvas now if we want to with just a little extra code.

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
This doesn't just modify your pixel objects, each pixel is tied directly to your binary data. Changing a property of the pixel object actually changes the data in the array buffer. If you download the original ArrayBuffer every other pixel will be blue. You can try this out [here](https://roblouie.com/structjs/bitmap-example/), or view the full code [here](https://github.com/roblouie/structjs/blob/master/examples/front-end/open-bitmap.js).

### TypeScript Support
StructJS includes TypeScript support. To get type checking and IDE auto-complete on your created structs, define an interface for each struct and extend StructData. Then simply use the interface when creating an object, or an array of the interface when creating an array
```js
interface BitmapHeader extends StructData {
  signature: number;
  fileSize: number;
  offsetToStartOfBitmapData: number;
}

// Info header omitted for brevity

interface BitmapPixel extends StructData {
  red: number;
  green: number;
  blue: number;
}

const bitmapHeader = bitmapHeaderStruct<BitmapHeader>.createObject(bitmapFileArrayBuffer, 0, true);
const pixels = pixelDataStruct.createArray<BitmapPixel>(bitmapFile, header.bitmapDataStart, numberOfPixels, true);
```

### Usage in Node

StructJS can be used in node just as on the front-end, just use require instead of import:

```js
const Struct = require('@binary-files/structjs');
```

And use the `.buffer` property of the `Buffer` object returned by `fs.readfile`:
```js
fs.readFile(path.join(__dirname, 'cartest.bmp'), (err, data) => {
  const header = headerStruct.createObject(data.buffer, 0, true);
  const infoHeader = infoHeaderStruct.createObject(data.buffer, header.byteLength, true);
  const numberOfPixels = infoHeader.imageWidth * infoHeader.imageHeight;
  const pixels = pixelDataStruct.createArray(data.buffer, header.bitmapDataStart, numberOfPixels, true);

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
I've omitted redefining the Structs here, see the front-end section for that, or the full example code [here](https://github.com/roblouie/structjs/blob/master/examples/node/open-bitmap.js).

## How it Works

StructJS is a helper class for JavaScript's built in [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). DataView uses an `ArrayBuffer` as its storage backing and allows getting and setting of various types. While this works, each getter and setter requires its own offset and its own boolean for endianess:

```
new DataView(arrayBuffer).setInt16(0, 256, true);
```

StructJS uses DataView, but also tracks endianess for the entire struct, lets you name the entries, stores their type and size, and keeps track each of their offsets for you. It then creates getters and setters for each property defined at instantiation. Those getters and setters in turn use the struct endianess, property offset, and property type to call the correct get or set on the DataView. 

In the first example when we do `bitmapHeader.fileSize` this runs `get fileSize()` on the `bitmapHeader` object. The getter checks that the type of `fileSize` is `'Uint32'`, and calls 

`this.dataView.getUint32(this.offsetTo.fileSize, this.isLittleEndian)` 

You can in fact replace `bitmapHeader.fileSize` with `bitmapHeader.dataView.getUint32(bitmapHeader.offsetTo.fileSize, bitmapHeader.isLittleEndian)` and the code will continue to function. Writing `bitmap.fileSize` is just much nicer.

## API

- [Constructor](#constructor)
  - [Struct(propertyInfo1, ...propertyInfoN)](https://github.com/roblouie/structjs#structpropertyinfo1-propertyinfon)
- [Type Definitions](#type-definitions)
  - [Struct.Int8(propertyName)](https://github.com/roblouie/structjs#structint8propertyname)
  - [Struct.Uint8(propertyName)](https://github.com/roblouie/structjs#structuint8propertyname)
  - [Struct.Int16(propertyName)](https://github.com/roblouie/structjs#structint16propertyname)
  - [Struct.Uint16(propertyName)](https://github.com/roblouie/structjs#structuint16propertyname)
  - [Struct.Int32(propertyName)](https://github.com/roblouie/structjs#structint32propertyname)
  - [Struct.Uint32(propertyName)](https://github.com/roblouie/structjs#structuint32propertyname)
  - [Struct.BigInt64(propertyName)](https://github.com/roblouie/structjs#structbigint64propertyname)
  - [Struct.BigUint64(propertyName)](https://github.com/roblouie/structjs#structbiguint64propertyname)
  - [Struct.Float32(propertyName)](https://github.com/roblouie/structjs#structfloat32propertyname)
  - [Struct.Float64(propertyName)](https://github.com/roblouie/structjs#structfloat64propertyname)
- [Instance Methods](#instance-methods)
  - [createObject(arrayBuffer, startOffset, isLittleEndian)](#createobjectarraybuffer-startoffset-islittleendian)
  - [createArray(arrayBuffer, startOffset, numberOfObjects, isLittleEndian)](#createarrayarraybuffer-startoffset-numberofobjects-islittleendian)

## Constructor

### Struct(propertyInfo1, ...propertyInfoN)
Creates a new Struct.
####  Parameters
`propertyInfo1, propertyInfo2, propertyInfoN`

One or more property definitions for your struct.
#### Returns
A Struct instance based on the definitions provided.

---

## Type Definitions

### Struct.Int8(propertyName)
Defines 8-bit signed integer.
####  Parameters
`propertyName`
What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Int8', byteLength: 1 }` used by the `Struct` constructor.

---

### Struct.Uint8(propertyName)
Defines 8-bit unsigned integer.
####  Parameters
`propertyName`
What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Uint8', byteLength: 1 }` used by the `Struct` constructor.

---

### Struct.Int16(propertyName)
Defines 16-bit signed integer.
####  Parameters
`propertyName`
What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Int16', byteLength: 2 }` used by the `Struct` constructor.

---

### Struct.Uint16(propertyName)
Defines 16-bit unsigned integer.
####  Parameters
`propertyName`
What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Uint16', byteLength: 2 }` used by the `Struct` constructor.

---

### Struct.Int32(propertyName)
Defines 32-bit signed integer.
####  Parameters
`propertyName`
What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Int32', byteLength: 4 }` used by the `Struct` constructor.

---

### Struct.Uint32(propertyName)
Defines 32-bit unsigned integer.
####  Parameters
`propertyName`
What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Uint32', byteLength: 4 }` used by the `Struct` constructor.

---

### Struct.BigInt64(propertyName)
Defines 64-bit signed big int.
####  Parameters
`propertyName`
What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'BigInt64', byteLength: 8 }` used by the `Struct` constructor.

---

### Struct.BigUint64(propertyName)
Defines 64-bit unsigned big int.
####  Parameters
`propertyName`
What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'BigUint64', byteLength: 8 }` used by the `Struct` constructor.

---

### Struct.Float32(propertyName)
Defines 32-bit floating point number.
####  Parameters
`propertyName`
What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Float32', byteLength: 4 }` used by the `Struct` constructor.

---

### Struct.Float64(propertyName)
Defines 64-bit floating point number.
####  Parameters
`propertyName`
What you want the property to be named in the resulting object.
#### Returns
A property info object with the format `{ propertyName, propertyType: 'Float64', byteLength: 8 }` used by the `Struct` constructor.

---

## Instance Methods

### createObject(arrayBuffer, startOffset, isLittleEndian)
Creates an object from an ArrayBuffer as defined by your struct.
#### Parameters
`arrayBuffer`
ArrayBuffer to create the object from.

`startOffset`
Position in the ArrayBuffer to start from.

`isLittleEndian`
Pass true to use little endian format. Defaults to big endian.

#### Returns
Object with properties defined in struct, as well as the backing Dataview, a collection of offsets to those properties in the DataView, and the total byte length of the object.

---

### createArray(arrayBuffer, startOffset, numberOfObjects, isLittleEndian)
Creates an array of objects from an ArrayBuffer as defined by your struct.
#### Parameters
`arrayBuffer`
ArrayBuffer to create the object from.

`startOffset`
Position in the ArrayBuffer to start from.

`isLittleEndian`
Pass true to use little endian format. Defaults to big endian.

#### Returns
Array of objects with properties defined in struct, as well as the backing Dataview, a collection of offsets to those properties in the DataView, and the total byte length of the object.
