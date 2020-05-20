import { Struct } from "./struct";

let dataView;

// beforeEach(() => {
//   dataView.setFloat32(30, 5.67, true);
//   dataView.setFloat64(34, 8.90, true);
// });

describe('8 bit integers', () => {
  let arrayBuffer;
  let eightBitStruct;

  beforeEach(() => {
    arrayBuffer = new ArrayBuffer(42);
    dataView = new DataView(arrayBuffer);
    dataView.setInt8(0, -100, true);
    dataView.setUint8(1, 100, true);
  });

  beforeAll(() => {
    eightBitStruct = new Struct(
      Struct.Int8('firstValue'),
      Struct.Uint8('secondValue'),
    );
  })
  
  test('8 bit ints can be read', () => {
    const singleBytes = eightBitStruct.getObject(arrayBuffer, 0, true);
    expect(singleBytes.firstValue).toBe(-100);
    expect(singleBytes.secondValue).toBe(100);
  });

  test('8 bit ints can be written', () => {
    const singleBytes = eightBitStruct.getObject(arrayBuffer, 0, true);
    singleBytes.firstValue = 1;
    singleBytes.secondValue = 2;
    expect(singleBytes.firstValue).toBe(1);
    expect(singleBytes.secondValue).toBe(2);
    expect(dataView.getInt8(0, true)).toBe(1);
    expect(dataView.getUint8(1, true)).toBe(2);
  });

  test('8 bit ints create a single byte offset to the next value', () => {
    const singleBytes = eightBitStruct.getObject(arrayBuffer, 0, true);
    expect(singleBytes.offsetTo.secondValue).toBe(1);
  });

  test('Each 8 bit int adds 1 byte to the structs total byteLength', () => {
    const singleBytes = eightBitStruct.getObject(arrayBuffer, 0, true);
    expect(singleBytes.byteLength).toBe(2);
    expect(eightBitStruct.byteLength).toBe(2);
  });
});

describe('16 bit integers', () => {
  let arrayBuffer;
  let sixteenBitStruct;

  beforeEach(() => {
    arrayBuffer = new ArrayBuffer(42);
    dataView = new DataView(arrayBuffer);
    dataView.setInt16(0, -200, true);
    dataView.setUint16(2, 200, true);
  });

  beforeAll(() => {
    sixteenBitStruct = new Struct(
      Struct.Int16('firstValue'),
      Struct.Uint16('secondValue'),
    );
  });

  test('16 bit ints can be read', () => {
    const doubleBytes = sixteenBitStruct.getObject(arrayBuffer, 0, true);
    expect(doubleBytes.firstValue).toBe(-200);
    expect(doubleBytes.secondValue).toBe(200);
  });

  test('16 bit ints can be written', () => {
    const doubleBytes = sixteenBitStruct.getObject(arrayBuffer, 0, true);
    doubleBytes.firstValue = 1;
    doubleBytes.secondValue = 2;
    expect(doubleBytes.firstValue).toBe(1);
    expect(doubleBytes.secondValue).toBe(2);
    expect(dataView.getInt16(0, true)).toBe(1);
    expect(dataView.getUint16(2, true)).toBe(2);
  });

  test('16 bit ints create a 2 byte offset to the next value', () => {
    const doubleBytes = sixteenBitStruct.getObject(arrayBuffer, 0, true);
    expect(doubleBytes.offsetTo.secondValue).toBe(2);
  });

  test('Each 16 bit int adds 2 bytes to the structs total byteLength', () => {
    const doubleBytes = sixteenBitStruct.getObject(arrayBuffer, 0, true);
    expect(doubleBytes.byteLength).toBe(4);
    expect(sixteenBitStruct.byteLength).toBe(4);
  });
});

describe('32 bit integers', () => {
  let arrayBuffer;
  let thirtyTwoBitStruct;

  beforeEach(() => {
    arrayBuffer = new ArrayBuffer(42);
    dataView = new DataView(arrayBuffer);
    dataView.setInt32(0, -300, true);
    dataView.setUint32(4, 300, true);
  });

  beforeAll(() => {
    thirtyTwoBitStruct = new Struct(
      Struct.Int32('firstValue'),
      Struct.Uint32('secondValue'),
    );
  });

  test('32 bit ints can be read', () => {
    const quadBytes = thirtyTwoBitStruct.getObject(arrayBuffer, 0, true);
    expect(quadBytes.firstValue).toBe(-300);
    expect(quadBytes.secondValue).toBe(300);
  });

  test('32 bit ints can be written', () => {
    const quadBytes = thirtyTwoBitStruct.getObject(arrayBuffer, 0, true);
    quadBytes.firstValue = 1;
    quadBytes.secondValue = 2;
    expect(quadBytes.firstValue).toBe(1);
    expect(quadBytes.secondValue).toBe(2);
    expect(dataView.getInt32(0, true)).toBe(1);
    expect(dataView.getUint32(4, true)).toBe(2);
  });

  test('32 bit ints create a 4 byte offset to the next value', () => {
    const quadBytes = thirtyTwoBitStruct.getObject(arrayBuffer, 0, true);
    expect(quadBytes.offsetTo.secondValue).toBe(4);
  });

  test('Each 32 bit int adds 4 bytes to the structs total byteLength', () => {
    const quadBytes = thirtyTwoBitStruct.getObject(arrayBuffer, 0, true);
    expect(quadBytes.byteLength).toBe(8);
    expect(thirtyTwoBitStruct.byteLength).toBe(8);
  });
});

describe('64 bit big integers', () => {
  let arrayBuffer;
  let sixtyFourBitStruct;

  beforeEach(() => {
    arrayBuffer = new ArrayBuffer(42);
    dataView = new DataView(arrayBuffer);
    dataView.setBigInt64(0, BigInt(-400), true);
    dataView.setBigUint64(8, BigInt(400), true);
  });

  beforeAll(() => {
    sixtyFourBitStruct = new Struct(
      Struct.BigInt64('firstValue'),
      Struct.BigUint64('secondValue'),
    );
  });

  test('64 bit big ints can be read', () => {
    const octBytes = sixtyFourBitStruct.getObject(arrayBuffer, 0, true);
    expect(octBytes.firstValue).toBe(-400n);
    expect(octBytes.secondValue).toBe(400n);
  });

  test('64 bit big ints can be written', () => {
    const octBytes = sixtyFourBitStruct.getObject(arrayBuffer, 0, true);
    octBytes.firstValue = BigInt(1);
    octBytes.secondValue = BigInt(2);
    expect(octBytes.firstValue).toBe(1n);
    expect(octBytes.secondValue).toBe(2n);
    expect(dataView.getBigInt64(0, true)).toBe(1n);
    expect(dataView.getBigUint64(8, true)).toBe(2n);
  });

  test('64 bit big ints create a 8 byte offset to the next value', () => {
    const octBytes = sixtyFourBitStruct.getObject(arrayBuffer, 0, true);
    expect(octBytes.offsetTo.secondValue).toBe(8);
  });

  test('Each 64 bit big int adds 8 bytes to the structs total byteLength', () => {
    const octBytes = sixtyFourBitStruct.getObject(arrayBuffer, 0, true);
    expect(octBytes.byteLength).toBe(16);
    expect(sixtyFourBitStruct.byteLength).toBe(16);
  });
});