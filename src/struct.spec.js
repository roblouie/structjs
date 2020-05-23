import Struct from "./struct";

let dataView;

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

describe('32 bit float', () => {
  let arrayBuffer;
  let thirtyTwoBitStruct;

  beforeEach(() => {
    arrayBuffer = new ArrayBuffer(42);
    dataView = new DataView(arrayBuffer);
    dataView.setFloat32(0, 123.45, true);
    dataView.setFloat32(4, 678.90, true);
  });

  beforeAll(() => {
    thirtyTwoBitStruct = new Struct(
      Struct.Float32('firstValue'),
      Struct.Float32('secondValue'),
    );
  });

  test('32 bit floats can be read', () => {
    const quadBytes = thirtyTwoBitStruct.getObject(arrayBuffer, 0, true);
    expect(quadBytes.firstValue.toFixed(2)).toBe('123.45');
    expect(quadBytes.secondValue.toFixed(2)).toBe('678.90');
  });

  test('32 bit floats can be written', () => {
    const quadBytes = thirtyTwoBitStruct.getObject(arrayBuffer, 0, true);
    quadBytes.firstValue = 1.1;
    quadBytes.secondValue = 2.2;
    expect(quadBytes.firstValue.toFixed(1)).toBe('1.1');
    expect(quadBytes.secondValue.toFixed(1)).toBe('2.2');
    expect(dataView.getFloat32(0, true).toFixed(1)).toBe('1.1');
    expect(dataView.getFloat32(4, true).toFixed(1)).toBe('2.2');
  });

  test('32 bit float create a 4 byte offset to the next value', () => {
    const quadBytes = thirtyTwoBitStruct.getObject(arrayBuffer, 0, true);
    expect(quadBytes.offsetTo.secondValue).toBe(4);
  });

  test('Each 32 bit float adds 4 bytes to the structs total byteLength', () => {
    const quadBytes = thirtyTwoBitStruct.getObject(arrayBuffer, 0, true);
    expect(quadBytes.byteLength).toBe(8);
    expect(thirtyTwoBitStruct.byteLength).toBe(8);
  });
});

describe('64 bit float', () => {
  let arrayBuffer;
  let sixtyFourBitStruct;

  beforeEach(() => {
    arrayBuffer = new ArrayBuffer(42);
    dataView = new DataView(arrayBuffer);
    dataView.setFloat64(0, 123.45, true);
    dataView.setFloat64(8, 678.90, true);
  });

  beforeAll(() => {
    sixtyFourBitStruct = new Struct(
      Struct.Float64('firstValue'),
      Struct.Float64('secondValue'),
    );
  });

  test('64 bit floats can be read', () => {
    const octBytes = sixtyFourBitStruct.createObject(arrayBuffer, 0, true);
    expect(octBytes.firstValue).toBe(123.45);
    expect(octBytes.secondValue).toBe(678.90);
  });

  test('64 bit floats can be written', () => {
    const octBytes = sixtyFourBitStruct.createObject(arrayBuffer, 0, true);
    octBytes.firstValue = 1.1;
    octBytes.secondValue = 2.2;
    expect(octBytes.firstValue).toBe(1.1);
    expect(octBytes.secondValue).toBe(2.2);
    expect(dataView.getFloat64(0, true).toFixed(1)).toBe('1.1');
    expect(dataView.getFloat64(8, true).toFixed(1)).toBe('2.2');
  });

  test('64 bit float create a 8 byte offset to the next value', () => {
    const octBytes = sixtyFourBitStruct.createObject(arrayBuffer, 0, true);
    expect(octBytes.offsetTo.secondValue).toBe(8);
  });

  test('Each 64 bit float adds 8 bytes to the structs total byteLength', () => {
    const octBytes = sixtyFourBitStruct.createObject(arrayBuffer, 0, true);
    expect(octBytes.byteLength).toBe(16);
    expect(sixtyFourBitStruct.byteLength).toBe(16);
  });
});


describe('Create an array of objects', () => {
  let arrayBuffer;
  let repeatingObjectStruct;

  beforeEach(() => {
    arrayBuffer = new ArrayBuffer(14);
    dataView = new DataView(arrayBuffer);
    dataView.setUint8(0, 1);
    dataView.setUint16(1, 2);
    dataView.setUint32(3, 3);
    dataView.setUint8(7, 4);
    dataView.setUint16(8, 5);
    dataView.setUint32(10, 6);
  });

  beforeAll(() => {
    repeatingObjectStruct = new Struct(
      Struct.Uint8('firstValue'),
      Struct.Uint16('secondValue'),
      Struct.Uint32('thirdValue'),
    );
  });

  test('Each element in the array of objects is populated based on the struct definition and ArrayBuffer values', () => {
    const myValues = repeatingObjectStruct.createArray(arrayBuffer, 0, 2);
    expect(myValues[0].firstValue).toBe(1);
    expect(myValues[0].secondValue).toBe(2);
    expect(myValues[0].thirdValue).toBe(3);
    expect(myValues[1].firstValue).toBe(4);
    expect(myValues[1].secondValue).toBe(5);
    expect(myValues[1].thirdValue).toBe(6);
  });

  test("The array length times the struct's byteLength results in the total size in bytes of the data read", () => {
    const myValues = repeatingObjectStruct.createArray(arrayBuffer, 0, 2);
    expect(myValues.length * repeatingObjectStruct.byteLength).toBe(arrayBuffer.byteLength);
  });

  test('Modifying an element in the array modifies the array buffer', () => {
    const myValues = repeatingObjectStruct.createArray(arrayBuffer, 0, 2);
    expect(myValues[0].firstValue).toBe(1);
    expect(myValues[1].secondValue).toBe(5);

    myValues[0].firstValue = 10;
    myValues[1].secondValue = 20;

    expect(myValues[0].firstValue).toBe(10);
    expect(myValues[1].secondValue).toBe(20);
    expect(dataView.getUint8(0)).toBe(10);
    expect(dataView.getUint16(8)).toBe(20);
  });

  test('Each element of the array has the same byte length', () => {
    const myValues = repeatingObjectStruct.createArray(arrayBuffer, 0, 2);
    expect(myValues[0].byteLength).toEqual(myValues[1].byteLength);
  });
});