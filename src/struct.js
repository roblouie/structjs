/** Class for creating structure definitions and generating objects and arrays with their defined structure from ArrayBuffers. */
export default class Struct {
  static Types = {
    Int8: 'Int8',
    Uint8: 'Uint8',
    Int16: 'Int16',
    Uint16: 'Uint16',
    Int32: 'Int32',
    Uint32: 'Uint32',
    BigInt64: 'BigInt64',
    BigUint64: 'BigUint64',
    Float32: 'Float32',
    Float64: 'Float64',
  }

  /**
   * Creates a struct definition from one or more property info objects. These objects can be generated for you using the static type methods.
   * @param {...Object} propertyInfo - An object that defines the property name, type, and size.
   * @example
   * const pixelStruct = new Struct(
   *   Struct.Uint8('red'),
   *   Struct.Uint8('green'),
   *   Struct.Uint8('blue'),  
   * );
   */
  constructor(...propertyInfos) {
    this.properties = propertyInfos;
    this.byteLength = propertyInfos.map(propertyInfo => propertyInfo.byteLength).reduce((accumulator, current) => accumulator + current);
    this.getObject = this.createObject;
    this.getObjects = this.createArray;
  }

  /**
   * Creates an array of objects from an ArrayBuffer as defined by your struct.
   * @param {ArrayBuffer} arrayBuffer - Array buffer to create the array from.
   * @param {number} startOffset - Position in the ArrayBuffer to start from.
   * @param {number} numberOfObjects - Number of objects to create.
   * @param {boolean} [isLittleEndian] - Pass true to use little endian format. Defaults to big endian.
   * @returns {Array} Array of objects with properties defined in struct, plus a byteLength property that defines the total byte lenght of the object.
   */
  createArray(arrayBuffer, startOffset, numberOfObjects, isLittleEndian) {
    const endPosition = startOffset + numberOfObjects * this.byteLength;

    const objects = [];

    for (let i = startOffset; i < endPosition; i += this.byteLength) {
      objects.push(this.createObject(arrayBuffer, i, isLittleEndian));
    }

    return objects;
  }

  /**
   * Creates an object from an ArrayBuffer as defined by your struct.
   * @param {ArrayBuffer} arrayBuffer - Array buffer to create the object from.
   * @param {number} startOffset - Position in the ArrayBuffer to start from.
   * @param {boolean} [isLittleEndian] - Pass true to use little endian format. Defaults to big endian.
   * @returns {Object} Object with properties defined in struct, plus a byteLength property that defines the total byte lenght of the object.
   */
  createObject(arrayBuffer, startOffset, isLittleEndian) {
    const createdObject = {
      offsetTo: {}
    };

    createdObject.dataView = new DataView(arrayBuffer);
    createdObject.isLittleEndian = isLittleEndian;

    let runningOffset = startOffset;

    this.properties.forEach(property => {
      createdObject.offsetTo[property.propertyName] = runningOffset;

      switch (property.propertyType) {
        case Struct.Types.Int8:
          Object.defineProperty(createdObject, property.propertyName, {
            get: () => createdObject.dataView.getInt8(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian),
            set: value => createdObject.dataView.setInt8(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian),
          });
          break;

        case Struct.Types.Uint8:
          Object.defineProperty(createdObject, property.propertyName, {
            get: () => createdObject.dataView.getUint8(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian),
            set: value => createdObject.dataView.setUint8(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian),
          });
          break;

        case Struct.Types.Int16:
          Object.defineProperty(createdObject, property.propertyName, {
            get: () => createdObject.dataView.getInt16(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian),
            set: value => createdObject.dataView.setInt16(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian),
          });
          break;

        case Struct.Types.Uint16:
          Object.defineProperty(createdObject, property.propertyName, {
            get: () => createdObject.dataView.getUint16(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian),
            set: value => createdObject.dataView.setUint16(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian),
          });
          break;

        case Struct.Types.Int32:
          Object.defineProperty(createdObject, property.propertyName, {
            get: () => createdObject.dataView.getInt32(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian),
            set: value => createdObject.dataView.setInt32(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian),
          });
          break;

        case Struct.Types.Uint32:
          Object.defineProperty(createdObject, property.propertyName, {
            get: () => createdObject.dataView.getUint32(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian),
            set: value => createdObject.dataView.setUint32(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian),
          });
          break;

        case Struct.Types.BigInt64:
          Object.defineProperty(createdObject, property.propertyName, {
            get: () => createdObject.dataView.getBigInt64(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian),
            set: value => createdObject.dataView.setBigInt64(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian),
          });
          break;

        case Struct.Types.BigUint64:
          Object.defineProperty(createdObject, property.propertyName, {
            get: () => createdObject.dataView.getBigUint64(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian),
            set: value => createdObject.dataView.setBigUint64(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian),
          });
          break;

        case Struct.Types.Float32:
          Object.defineProperty(createdObject, property.propertyName, {
            get: () => createdObject.dataView.getFloat32(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian),
            set: value => createdObject.dataView.setFloat32(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian),
          });
          break;

        case Struct.Types.Float64:
          Object.defineProperty(createdObject, property.propertyName, {
            get: () => createdObject.dataView.getFloat64(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian),
            set: value => createdObject.dataView.setFloat64(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian),
          });
          break;
      }

      runningOffset += property.byteLength;
    });

    createdObject.byteLength = runningOffset;

    return createdObject;
  }

  /**
  * Defines an 8-bit integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Int8(propertyName) {
    return {
      propertyName,
      propertyType: Struct.Types.Int8,
      byteLength: 1,
    }
  }

  /**
  * Defines an 8-bit unsigned integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Uint8(propertyName) {
    return {
      propertyName,
      propertyType: Struct.Types.Uint8,
      byteLength: 1,
    }
  }

  /**
  * Defines a 16-bit integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Int16(propertyName) {
    return {
      propertyName,
      propertyType: Struct.Types.Int16,
      byteLength: 2,
    }
  }

  /**
  * Defines a 16-bit unsigned integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Uint16(propertyName) {
    return {
      propertyName,
      propertyType: Struct.Types.Uint16,
      byteLength: 2,
    }
  }

  /**
  * Defines a 32-bit integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Int32(propertyName) {
    return {
      propertyName,
      propertyType: Struct.Types.Int32,
      byteLength: 4,
    }
  }

  /**
  * Defines a 32-bit unsigned integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Uint32(propertyName) {
    return {
      propertyName,
      propertyType: Struct.Types.Uint32,
      byteLength: 4,
    }
  }

  /**
  * Defines a 64-bit big integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static BigInt64(propertyName) {
    return {
      propertyName,
      propertyType: Struct.Types.BigInt64,
      byteLength: 8,
    }
  }

  /**
  * Defines a 64-bit unsigned big integer. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static BigUint64(propertyName) {
    return {
      propertyName,
      propertyType: Struct.Types.BigUint64,
      byteLength: 8,
    }
  }

  /**
  * Defines a 32-bit float. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Float32(propertyName) {
    return {
      propertyName,
      propertyType: Struct.Types.Float32,
      byteLength: 4,
    }
  }

  /**
  * Defines a 64-bit float. Used for struct definition.
  * @param {string} propertyName - Property name.
  * @returns {Object} Property info object containing the property name, type and length in bytes.
  */
  static Float64(propertyName) {
    return {
      propertyName,
      propertyType: Struct.Types.Float64,
      byteLength: 8,
    }
  }
}
