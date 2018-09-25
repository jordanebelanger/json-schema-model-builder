const {PrimitiveType} = require('../primitive')
const {checkType} = require('../base')

function isBoolean(property) {
  return checkType(property, 'boolean')
}

function resolve({property, config}) {
  return isBoolean(property) && BooleanType.create({property, config})
}

class BooleanType extends PrimitiveType {
  static create(obj) {
    return new BooleanType(obj)
  }

  get resolvedTypeName() {
    return camelize(this._types.boolean || 'Boolean')
  }
}

module.exports = {
  resolve,
  isBoolean,
  BooleanType
}
