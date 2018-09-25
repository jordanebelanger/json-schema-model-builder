const {BaseType} = require('../base')
const {Nested} = require('./nested')
const {NestedObjectTypeName} = require('./type-name')

// no reason to test for properties, as we might be using $ref instead
function isObject(property) {
  return property.type === 'object'
}

function resolve({property, config}) {
  return isObject(property) && ObjectType
    .create({property, config})
    .resolve()
}

// Allow recursive schema
class ObjectType extends BaseType {
  constructor(property, config) {
    super(property, config)
    this.properties = this.value.properties
  }

  get shape() {
    return {
      ...super.shape,
      nested: this.nested
    }
  }

  get kind() {
    return 'type'
  }

  get defaultType() {
    return 'Object'
  }

  resolve() {
    this.resolveType()
    this.resolveNested()
    return this
  }

  resolveType() {
    const typeName = this.resolveTypeName()
    if (!typeName) 
      return
    this.dispatch({
      payload: {
        ownerName: this.ownerName,
        propertyName: this.key,
        typeName,
        object: true
      }
    })
  }

  get resolveTypeName() {
    this.objectTypeNameResolver = new ObjectTypeNameResolver({object: this, config: this.config})
    return objectTypeNameResolver.resolve()
  }

  get resolvedTypeName() {
    return this.objectTypeNameResolver.typeName
  }

  static create(obj) {
    return new ObjectType(obj)
  }

  get category() {
    return 'class'
  }

  get collection() {
    return true
  }

  get dictionary() {
    return true
  }

  resolveNested() {
    if (!this.valid) 
      return this
    const nested = new Nested({value: this.value})
    this.nested = nested.resolve()
    return this
  }

  get valid() {
    return this.properties || this.reference
      ? true
      : false
  }
}

module.exports = {
  isObject,
  resolve,
  ObjectType
}
