# StructJS

StructJS aims to create a C-like struct type to make working with binary files easier. It also tries to be as simple as possible and make good use existing file access features of JavaScript like [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView).

Struct makes it easy to both read and modify ANY file of ANY type, provided you know how that file is **struct**ured.

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

If we open a bitmap image file into an ArrayBuffer using a FileReader, StructJS makes it easy to read this data out of the ArrayBuffer and into a nicely defined object.
```
import Struct from '@rlouie/structjs'

// Struct works with ArrayBuffers, here we get one from a file reader that read in a .bmp image file
const bitmapFileArrayBuffer = readBitmapImageFile();

// Define our struct that represents the layout of a bitmap file header
const bitmapHeaderStruct = new Struct(
  Struct.Uint16('signature'),
  Struct.Uint32('fileSize'),
  Struct.Uint32('unused'),
  Struct.Uint32('bitmapDataStart')
);

// Read from the array buffer into an object built from our struct, starting at the beginning
// and in little endian format.
const bitmapHeader = bitmapHeaderStruct.getObject(bitmapFileArrayBuffer, 0, true);

// Log out the bitmap file size in bytes, as read from the file's header
console.log(bitmpHeader.fileSize);
```
You now have a usable and easy to read data definitely for your file header!

We can actually continue on with this and define out the rest of the file based on the documented structure.
```
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

// Bitmaps store pixels in BGR format instead of RGB
const pixelDataStruct = new Struct(
  Struct.Uint8('blue'),
  Struct.Uint8('green'),
  Struct.Uint8('red')
);

const infoHeader = infoHeaderStruct.getObject(bitmapFile, header.byteLength, true);
const numberOfPixels = infoHeader.imageWidth * infoHeader.imageHeight;

// Read from the array buffer into an array of objects built from our struct, starting at the beginning of the bitmap 
// data, and reading number of pixels times, in little endian format. The result will be an array the size of
// numberOfPixels, where each element of the array is an object defined by our struct.
const pixels = pixelDataStruct.getObjects(bitmapFile, header.bitmapDataStart, numberOfPixels, true);
```
And believe it or not, that's it! We just read in an entire bitmap image file exactly to spec. We can draw the image into a canvas now if we want to with just a little extra code.

```
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
And that's it! We read in a bitmap image file and drew it to the canvas. But that's not all, the properties of the generated objects are **not** read only, you can modify the file by modifying the properties. For instance we can turn every other pixel in the bitmap image file blue by modifying the pixels.
```
pixels.forEach((pixel, index) => {
  if (index % 2 === 0) {
    pixel.red = 0;
    pixel.green = 0;
    pixel.blue = 255;
  }
});
```

If you then create a blob from the original array buffer we read in, you can download the file and see that every other pixel is blue now!

`const blob = new Blob([bitmapFileArrayBuffer], { type: "image/bitmap" });`

Your generated objects are actually tied to the binary data in the file. This means that not only can you read the data, but that by modifying a property, you modify the cooresponding byte(s) in the file data.

We can of course follow the same principle with any binary file, making reading and modifying any file easy!
