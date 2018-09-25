const {createDefinitionRefResolver} = require('./definition-ref')

describe('DefinitionRefResolver', () => {
  const reference = '#/definitions/car'
  const schema = {
    definitions: {
      car: {
        type: 'object',
        name: 'superCar',
        properties: {}
      }
    }
  }

  const resolver = createDefinitionRefResolver({reference, schema})

  describe('normalizedRef', () => {
    const {normalizedRef} = resolver

    test('is car', () => {
      expect(normalizedRef).toEqual('definitions/car')
    })
  })

  describe('dotPath', () => {
    const {dotPath} = resolver

    test('is car', () => {
      expect(dotPath).toEqual('definitions.car')
    })
  })

  describe('refName', () => {
    const {refName} = resolver

    test('is car', () => {
      expect(refName).toEqual('car')
    })
  })

  describe('refObject', () => {
    const {refObject} = resolver

    test('is an object with name: superCar', () => {
      expect(typeof refObject).toEqual('object')
      expect(refObject.name).toEqual('superCar')
    })
  })

  describe('name', () => {
    const {name} = resolver

    test('is superCar', () => {
      expect(name).toEqual('superCar')
    })
  })

  describe('typeName', () => {
    const {typeName} = resolver

    test('is SuperCar', () => {
      expect(typeName).toEqual('SuperCar')
    })
  })
})
