interface PropertyInfo {
    propertyName: string;
    propertyType: string;
    byteLength: number;
}
interface StructObject {
    offsetTo: Object;
    dataView: DataView;
    isLittleEndian: boolean;
    byteLength: number;
}

/** Class for creating structure definitions and generating objects and arrays with their defined structure from ArrayBuffers. */
export default class Struct {
  static Types: {
    Int8: string;
    Uint8: string;
    Int16: string;
    Uint16: string;
    Int32: string;
    Uint32: string;
    BigInt64: string;
    BigUint64: string;
    Float32: string;
    Float64: string;
  };
  properties: PropertyInfo[];
  byteLength: number;

  /**
  * Creates a struct definition from one or more property info objects. These objects can be generated for you using the static definition methods.
  * @param {...PropertyInfo} propertyInfo - One or more property definitions for the struct.
  * @example
  * const pixelStruct = new Struct(
  *   Struct.Uint8('red'),
  *   Struct.Uint8('green'),
  *   Struct.Uint8('blue'),
  * );
  */
  constructor(...propertyInfos: PropertyInfo[]);

  /**
   * Creates an array of objects from an ArrayBuffer as defined by your struct.
   * @param {ArrayBuffer} arrayBuffer - Array buffer to create the array from.
   * @param {number} startOffset - Position in the ArrayBuffer to start from.
   * @param {number} numberOfObjects - Number of objects to create.
   * @param {boolean} [isLittleEndian] - Pass true to use little endian format. Defaults to big endian.
   * @returns {Array} Array of objects with properties defined in struct, plus a byteLength property that defines the total byte lenght of the object.
   */
  createArray(arrayBuffer: ArrayBuffer, startOffset: number, numberOfObjects: number, isLittleEndian?: boolean): StructObject[];

  /**
   * Creates an object from an ArrayBuffer as defined by your struct.
   * @param {ArrayBuffer} arrayBuffer - Array buffer to create the object from.
   * @param {number} startOffset - Position in the ArrayBuffer to start from.
   * @param {boolean} [isLittleEndian] - Pass true to use little endian format. Defaults to big endian.
   * @returns {StructObject} Object with properties defined in struct, plus a byteLength property that defines the total byte lenght of the object.
   */
  createObject(arrayBuffer: ArrayBuffer, startOffset: number, isLittleEndian?: boolean): StructObject;
  
  /**
  * Defines an 8-bit integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {PropertyInfo} Property info object containing the property name, type and length in bytes.
  */
  static Int8(propertyName: string): PropertyInfo;

  /**
  * Defines an 8-bit unsigned integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Uint8(propertyName: string): PropertyInfo;

  /**
  * Defines a 16-bit integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Int16(propertyName: string): PropertyInfo;

  /**
  * Defines a 16-bit unsigned integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Uint16(propertyName: string): PropertyInfo;

  /**
  * Defines a 32-bit integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Int32(propertyName: string): PropertyInfo;

  /**
  * Defines a 32-bit unsigned integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Uint32(propertyName: string): PropertyInfo;

  /**
  * Defines a 64-bit big integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static BigInt64(propertyName: string): PropertyInfo;

  /**
  * Defines a 64-bit unsigned big integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static BigUint64(propertyName: string): PropertyInfo;

  /**
  * Defines a 32-bit float. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Float32(propertyName: string): PropertyInfo;

  /**
  * Defines a 64-bit float. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Float64(propertyName: string): PropertyInfo;
}
export {};
