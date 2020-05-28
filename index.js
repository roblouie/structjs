"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Struct = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Struct = /*#__PURE__*/function () {
  function Struct() {
    _classCallCheck(this, Struct);

    for (var _len = arguments.length, propertyInfos = new Array(_len), _key = 0; _key < _len; _key++) {
      propertyInfos[_key] = arguments[_key];
    }

    this.properties = propertyInfos;
    this.byteLength = propertyInfos.map(function (propertyInfo) {
      return propertyInfo.byteLength;
    }).reduce(function (accumulator, current) {
      return accumulator + current;
    });
    this.getObject = this.createObject;
    this.getObjects = this.createArray;
  }

  _createClass(Struct, [{
    key: "createArray",
    value: function createArray(arrayBuffer, startOffset, numberOfObjects, isLittleEndian) {
      var endPosition = startOffset + numberOfObjects * this.byteLength;
      var objects = [];

      for (var i = startOffset; i < endPosition; i += this.byteLength) {
        objects.push(this.createObject(arrayBuffer, i, isLittleEndian));
      }

      return objects;
    }
  }, {
    key: "createObject",
    value: function createObject(arrayBuffer, startOffset, isLittleEndian) {
      var createdObject = {
        offsetTo: {}
      };
      createdObject.dataView = new DataView(arrayBuffer);
      createdObject.isLittleEndian = isLittleEndian;
      var runningOffset = startOffset;
      this.properties.forEach(function (property) {
        createdObject.offsetTo[property.propertyName] = runningOffset;

        switch (property.propertyType) {
          case Struct.Types.Int8:
            Object.defineProperty(createdObject, property.propertyName, {
              get: function get() {
                return createdObject.dataView.getInt8(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian);
              },
              set: function set(value) {
                return createdObject.dataView.setInt8(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian);
              }
            });
            break;

          case Struct.Types.Uint8:
            Object.defineProperty(createdObject, property.propertyName, {
              get: function get() {
                return createdObject.dataView.getUint8(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian);
              },
              set: function set(value) {
                return createdObject.dataView.setUint8(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian);
              }
            });
            break;

          case Struct.Types.Int16:
            Object.defineProperty(createdObject, property.propertyName, {
              get: function get() {
                return createdObject.dataView.getInt16(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian);
              },
              set: function set(value) {
                return createdObject.dataView.setInt16(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian);
              }
            });
            break;

          case Struct.Types.Uint16:
            Object.defineProperty(createdObject, property.propertyName, {
              get: function get() {
                return createdObject.dataView.getUint16(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian);
              },
              set: function set(value) {
                return createdObject.dataView.setUint16(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian);
              }
            });
            break;

          case Struct.Types.Int32:
            Object.defineProperty(createdObject, property.propertyName, {
              get: function get() {
                return createdObject.dataView.getInt32(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian);
              },
              set: function set(value) {
                return createdObject.dataView.setInt32(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian);
              }
            });
            break;

          case Struct.Types.Uint32:
            Object.defineProperty(createdObject, property.propertyName, {
              get: function get() {
                return createdObject.dataView.getUint32(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian);
              },
              set: function set(value) {
                return createdObject.dataView.setUint32(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian);
              }
            });
            break;

          case Struct.Types.BigInt64:
            Object.defineProperty(createdObject, property.propertyName, {
              get: function get() {
                return createdObject.dataView.getBigInt64(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian);
              },
              set: function set(value) {
                return createdObject.dataView.setBigInt64(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian);
              }
            });
            break;

          case Struct.Types.BigUint64:
            Object.defineProperty(createdObject, property.propertyName, {
              get: function get() {
                return createdObject.dataView.getBigUint64(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian);
              },
              set: function set(value) {
                return createdObject.dataView.setBigUint64(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian);
              }
            });
            break;

          case Struct.Types.Float32:
            Object.defineProperty(createdObject, property.propertyName, {
              get: function get() {
                return createdObject.dataView.getFloat32(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian);
              },
              set: function set(value) {
                return createdObject.dataView.setFloat32(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian);
              }
            });
            break;

          case Struct.Types.Float64:
            Object.defineProperty(createdObject, property.propertyName, {
              get: function get() {
                return createdObject.dataView.getFloat64(createdObject.offsetTo[property.propertyName], createdObject.isLittleEndian);
              },
              set: function set(value) {
                return createdObject.dataView.setFloat64(createdObject.offsetTo[property.propertyName], value, createdObject.isLittleEndian);
              }
            });
            break;
        }

        runningOffset += property.byteLength;
      });
      createdObject.byteLength = runningOffset - startOffset;
      createdObject.nextOffset = runningOffset;
      createdObject.endPosition = runningOffset - 1;
      return createdObject;
    }
  }], [{
    key: "Int8",
    value: function Int8(propertyName) {
      return {
        propertyName: propertyName,
        propertyType: Struct.Types.Int8,
        byteLength: 1
      };
    }
  }, {
    key: "Uint8",
    value: function Uint8(propertyName) {
      return {
        propertyName: propertyName,
        propertyType: Struct.Types.Uint8,
        byteLength: 1
      };
    }
  }, {
    key: "Int16",
    value: function Int16(propertyName) {
      return {
        propertyName: propertyName,
        propertyType: Struct.Types.Int16,
        byteLength: 2
      };
    }
  }, {
    key: "Uint16",
    value: function Uint16(propertyName) {
      return {
        propertyName: propertyName,
        propertyType: Struct.Types.Uint16,
        byteLength: 2
      };
    }
  }, {
    key: "Int32",
    value: function Int32(propertyName) {
      return {
        propertyName: propertyName,
        propertyType: Struct.Types.Int32,
        byteLength: 4
      };
    }
  }, {
    key: "Uint32",
    value: function Uint32(propertyName) {
      return {
        propertyName: propertyName,
        propertyType: Struct.Types.Uint32,
        byteLength: 4
      };
    }
  }, {
    key: "BigInt64",
    value: function BigInt64(propertyName) {
      return {
        propertyName: propertyName,
        propertyType: Struct.Types.BigInt64,
        byteLength: 8
      };
    }
  }, {
    key: "BigUint64",
    value: function BigUint64(propertyName) {
      return {
        propertyName: propertyName,
        propertyType: Struct.Types.BigUint64,
        byteLength: 8
      };
    }
  }, {
    key: "Float32",
    value: function Float32(propertyName) {
      return {
        propertyName: propertyName,
        propertyType: Struct.Types.Float32,
        byteLength: 4
      };
    }
  }, {
    key: "Float64",
    value: function Float64(propertyName) {
      return {
        propertyName: propertyName,
        propertyType: Struct.Types.Float64,
        byteLength: 8
      };
    }
  }]);

  return Struct;
}();

exports.Struct = Struct;

_defineProperty(Struct, "Types", {
  Int8: 'Int8',
  Uint8: 'Uint8',
  Int16: 'Int16',
  Uint16: 'Uint16',
  Int32: 'Int32',
  Uint32: 'Uint32',
  BigInt64: 'BigInt64',
  BigUint64: 'BigUint64',
  Float32: 'Float32',
  Float64: 'Float64'
});
