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

If we open a bitmap image file into an ArrayBuffer using a FileReader, StructJS makes it easy to read this data out of the ArrayBuffer and into a nicely defined object. First we get an array buffer and define our struct based on the header structure:
```
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
```
const bitmapHeader = bitmapHeaderStruct.getObject(bitmapFileArrayBuffer, 0, true);

console.log(bitmpHeader.fileSize);
```
And that's it. This code will log the bitmap file size to the console using the data read from the file header.

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
```
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
Great! We read in a bitmap image file and drew it to the canvas. But that's not all, the properties of the generated objects are **not** read only, you can modify the file by modifying the properties. For instance we can turn every other pixel in the bitmap image file blue by modifying the pixels.
```
pixels.forEach((pixel, index) => {
  if (index % 2 === 0) {
    pixel.red = 0;
    pixel.green = 0;
    pixel.blue = 255;
  }
});
```
This doesn't just modify your pixel objects, each pixel is tied directly to your binary data. Changing a property of the pixel object actually changes the data in the array buffer. If you create a blob from the original array buffer we read in, you can download the file and see that every other pixel is blue now!

`const blob = new Blob([bitmapFileArrayBuffer], { type: "image/bitmap" });`

Your generated objects are actually tied to the binary data in the file. This means that not only can you read the data, but that by modifying a property, you modify the cooresponding byte(s) in the file data.

We can of course follow the same principle with any binary file, making reading and modifying any file easy!
