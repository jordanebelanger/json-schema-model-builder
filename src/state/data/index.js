const colors = {
  name: 'colors',
  $type: 'enum',
  values: ['red', 'blue']
}

const person = {
  name: 'person',
  $type: 'type',
  properties: {
    age: 32
  }
}

const union = {
  name: 'waterbed',
  types: ['water', 'bed']
}

const car = {
  name: 'car',
  $type: 'type',
  properties: {
    brand: 'BMW'
  }
}

module.exports = {
  colors,
  person,
  car,
  union
}
