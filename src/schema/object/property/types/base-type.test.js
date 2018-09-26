const {BaseType, $BaseType, checkType} = require('./base')

describe('checkType', () => {
  describe('not an object', () => {
    test('throws', () => {
      try {
        checkType('x', 'string')
      } catch (err) {
        expect(err).toBeTruthy()
      }

    })
  })

  describe('empty property obj', () => {
    test('is false', () => {
      expect(checkType({}, 'string')).toBeFalsy()
    })
  })

  describe('has correct type', () => {
    test('is true', () => {
      expect(checkType({
        type: 'string'
      }, 'string')).toBeTruthy()
    })
  })

  describe('has wrong type', () => {
    test('is false', () => {
      expect(checkType({
        type: 'number'
      }, 'string')).toBeFalsy()
    })
  })
})

const format = 'date-time'
const owner = {
  name: 'person'
}
const type = 'string'
const name = 'myName'
const required = true
const key = 'kitty'
const $ref = '#/definitions/car'
const reference = $ref
const resolveSchema = () => {
  type : 'number'
}
const rootSchema = {
  definitions: {
    car: {
      type: 'object'
    }
  }
}

const property = {
  format,
  required: true,
  owner,
  type,
  format,
  name,
  required,
  key,
  $ref
}

const propDecObj = {
  classDec: 1,
  propDec: 3
}

const classDecObj = {
  classDec: 2
}

const config = {
  namespace: 'db',
  resolveSchema,
  rootSchema,
  decorators: {
    [owner.name]: {
      [key]: classDecObj
    },
    [key]: propDecObj
  }
}

describe('$BaseType', () => {
  describe('constructor', () => {
    const base = new $BaseType({property, config})

    test('key', () => {
      expect(base.key).toBe(key)
    })

    test('name', () => {
      expect(base.name).toBe(name)
    })

    test('owner', () => {
      expect(base.owner.ame).toBe(owner.name)
    })

    test('type', () => {
      expect(base.type).toBe(type)
    })

    test('format', () => {
      expect(base.format).toEqual(format)
    })

    test('required', () => {
      expect(base.required).toBe(true)
    })

    test('config', () => {
      expect(base.config).toBe(config)
    })

    test('resolveSchema', () => {
      expect(base.resolveSchema).toBe(resolveSchema)
    })

    test('rootSchema', () => {
      expect(base.rootSchema).toBe(rootSchema)
    })

    test('reference', () => {
      expect(base.reference).toBe(reference)
    })

    describe('extractDecorators', () => {
      base.extractDecorators()

      test('ownMeta', () => {
        expect(base.ownMeta).toEqual({})
      })

      test('classDecorators extracted', () => {
        expect(base.classDecorators).toEqual({classDec: 2})
      })

      test('propDecorators extracted', () => {
        expect(base.propDecorators).toEqual({classDec: 1, propDec: 3})
      })

      test('decorators merged', () => {
        expect(base.decorators).toEqual({classDec: 2, propDec: 3})
      })
    })

    describe('extractMeta', () => {})

    describe('resolveAndMergeReferenced', () => {})

    describe('initialize', () => {})
  })
})

describe.only('BaseType', () => {
  const base = new BaseType({property, config})
  const entity = {
    name: 'x'
  }
  const payload = {
    type: 'Car'
  }

  test('sender', () => {
    expect(base.sender).toEqual('propertyType')
  })

  describe('onEntity', () => {
    base.onEntity(entity)
    expect(base.lastSent.payload).toEqual(entity)
  })

  describe('dispatch', () => {
    beforeEach(() => {
      base.lastDispatchedEvent = undefined
    })

    test('has dispatcher: dispatches', () => {
      base.dispatcher = {
        dispatch: () => 'x'
      }
      base.dispatch(payload)
      expect(base.lastDispatchedEvent.payload).toBe(payload)
    })

    test('no dispatcher: no dispatch', () => {
      base.dispatcher = null
      base.dispatch(payload)
      expect(base.lastDispatchedEvent).toBeUndefined()
    })
  })

  test('defaultType', () => {
    expect(base.defaultType).toEqual('any')
  })

  test('baseType', () => {
    expect(base.baseType).toEqual('any')
  })

  test('fullName', () => {
    expect(base.fullName).toEqual('person_kitty')
  })

  test('fullTypeName', () => {
    expect(base.fullTypeName).toEqual('PersonKitty')
  })

  test('typeName', () => {
    expect(base.typeName).toEqual('Car')
  })

  test('resolvedTypeName', () => {
    expect(base.resolvedTypeName).toEqual('Car')
  })

  test('collection', () => {
    expect(base.collection).toBeFalsy()
  })

  test('list', () => {
    expect(base.list).toBeFalsy()
  })

  test('dictionary', () => {
    expect(base.dictionary).toBeFalsy()
  })

  test('configType', () => {
    expect(base.configType).toBeFalsy()
  })

  test('overrideType', () => {
    expect(base.overrideType).toBeFalsy()
  })

  describe('refType', () => {
    test('reference', () => {
      expect(base.refType).toEqual('reference')
    })

    test('embedded', () => {
      base.reference = undefined
      expect(base.refType).toEqual('embedded')
    })
  })

  describe('kind', () => {
    test('type.kind', () => {
      expect(base.kind).toEqual('primitive')
    })
  })

  describe('shape', () => {
    const {shape} = base

    test('is a snapshot object with many keys', () => {
      expect(typeof shape).toEqual('object')
      expect(Object.keys(shape).length > 3).toBeTruthy()
    })

    test('decorators', () => {
      expect(shape.decorators).toEqual({classDec: 2, propDec: 3})
    })

    test('name', () => {
      expect(shape.name).toEqual({key: 'kitty', owner: 'person', property: 'myName'})
    })

    test('type', () => {
      expect(shape.type).toEqual({
        property: 'string',
        format: 'date-time',
        base: 'any',
        expanded: 'string',
        fullName: 'PersonKitty',
        kind: 'primitive',
        reference: {
          name: 'Car',
          names: [],
          resolved: '#/definitions/car'
        },
        resolved: 'Car'
      })
    })
  })
})
