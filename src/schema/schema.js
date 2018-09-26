const {Base} = require('../base')
const {object} = require('./object')
const {resolve} = object

const createSchema = ({schema, config}) => {
  return new Schema({schema, config})
}

class Schema extends Base {
  constructor({schema, config}) {
    this.schema = schema
    this.properties = schema.properties
  }

  resolve() {
    resolve({
      object: this.schema,
      config: this.config,
      opts: {
        schema: true
      }
    })
  }
}

module.exports = {
  createSchema,
  Schema
}
