# StructJS

StructJS aims to create a C-like struct type to make working with binary files easier. It also tries to be as simple as possible and make good use existing file access features of JavaScript like [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView).

## Installation

Install the package:

`npm install @rlouie/structjs`

## Usage

For an example, let's start building a program that reads in a bitmap image file and displays information about the file. Using [information about the files format](http://www.ece.ualberta.ca/~elliott/ee552/studentAppNotes/2003_w/misc/bmp_file_format/bmp_file_format.htm) we know that the file header should look like this:

### Bitmap File Header

| Size | Description |
|---------|----------|
| 2 bytes | File signature |
| 4 bytes | File size in bytes |
| 4 bytes | Unused |
| 4 bytes | Offset from the start of the file to where the actual bitmap pixel image data is stored |

If we open a bitmap image file into an ArrayBuffer using a FileReader, Struct makes it easy to read this data out of the ArrayBuffer and into a nicely defined object.
```
import Struct from '@rlouie/structjs'

// Struct works with ArrayBuffers, here we get one from a file reader that read in a .bmp image file
const bitmapFileArrayBuffer = readBitmapImageFile();

// Define our struct that represents the layout of a bitmap file header
const bitmapHeaderStruct = new Struct(
  Struct.Uint16('signature'),
  Struct.Uint32('fileSize'),
  Struct.Uint32('unused'),
  Struct.Uint32('offsetToStartOfBitmapData')
);

// Read from the array buffer into an object built from our struct, starting at the beginning and in little endian format.
const bitmapHeader = bitmapHeaderStruct.getObject(bitmapFileArrayBuffer, 0, true);

// Will log out the bitmap file size in bytes, as read from the file's header
console.log(bitmpHeader.fileSize);
```
