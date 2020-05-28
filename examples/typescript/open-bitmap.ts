import { HeaderData, headerStruct, infoHeaderStruct, pixelDataStruct, PixelData, InfoHeaderData } from './bitmap-definitions';

let pixels: PixelData[];
let bitmapFileArrayBuffer: ArrayBuffer;
let filename: string;

window.onload = () => {
  document.getElementById('file-input').addEventListener('change', onFileSelect);
  document.getElementById('turn-blue').addEventListener('click', turnPixelsBlueAndDownload);
}

function onFileSelect(event: Event) {
  const files = (<HTMLInputElement>event.target).files;
  filename = files[0].name;
  const reader = new FileReader();
  reader.onload = event => parseBitmap(<ArrayBuffer>event.target.result);
  reader.readAsArrayBuffer(files[0]);
}

function parseBitmap(bitmapArrayBuffer: ArrayBuffer) {
  bitmapFileArrayBuffer = bitmapArrayBuffer;
  const header: HeaderData = headerStruct.createObject<HeaderData>(bitmapFileArrayBuffer , 0, true);
  const infoHeader = infoHeaderStruct.createObject<InfoHeaderData>(bitmapFileArrayBuffer , header.byteLength, true);
  const imageSize = infoHeader.imageWidth * infoHeader.imageHeight;
  pixels = pixelDataStruct.createArray<PixelData>(bitmapFileArrayBuffer, header.offsetToStartOfBitmapData, imageSize, true);

  updateUI(infoHeader);
}

function updateUI(infoHeader: InfoHeaderData) {
  const imageSizeDiv = document.querySelector('#image-size');
  const bitsPerPixelDiv = document.querySelector('#bits-per-pixel');
  const pixelCountDiv = document.querySelector('#total-pixel-count');
  const canvasContext = document.querySelector('canvas').getContext('2d');

  imageSizeDiv.textContent = `Image Size: ${infoHeader.imageWidth} x ${infoHeader.imageHeight}`;
  bitsPerPixelDiv.textContent = `Bits Per Pixel: ${infoHeader.bitsPerPixel}`;
  pixelCountDiv.textContent = `Image size in bytes (width * height * bytes per pixel): ${infoHeader.bitmapDataSize}`;

  if (infoHeader.bitsPerPixel !== 24) {
    alert('For simplicy this example only renders 24-bit bitmaps, but you can still view info about the file.');
    return;
  }

  const imageData = new ImageData(infoHeader.imageWidth, infoHeader.imageHeight);

  pixels.forEach((pixel, index) => {
    const imageDataIndex = index * 4;
    imageData.data[imageDataIndex] = pixel.red;
    imageData.data[imageDataIndex + 1] = pixel.green;
    imageData.data[imageDataIndex + 2] = pixel.blue;
    imageData.data[imageDataIndex + 3] = 255; // Solid opacity
  });

  canvasContext.putImageData(imageData, 0, 0);
}

function turnPixelsBlueAndDownload() {
  pixels.forEach((pixel, index) => {
    if (index % 2 === 0) {
      pixel.red = 0;
      pixel.green = 0;
      pixel.blue = 255;
    }
  });

  downloadBitmapArrayBuffer();
}

function downloadBitmapArrayBuffer() {
  const blob = new Blob([bitmapFileArrayBuffer], { type: "image/bitmap" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
