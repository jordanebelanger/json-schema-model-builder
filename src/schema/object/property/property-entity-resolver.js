const { Base } = require("../../../base");
const {
  isStringType,
  isObjectType,
  isFunctionType,
  assignAt
} = require("../../../utils");

const createPropertyEntityResolver = ({ property, config = {} }) => {
  const constructors = config.constructors || {};
  const $PropertyEntityResolver =
    constructors.PropertyEntityResolver || PropertyEntityResolver;
  return new PropertyEntityResolver({ property, config });
};

class PropertyEntityResolver extends Base {
  constructor({ property, config }) {
    super(config);
    this.property = property;
    this.config = config;
    this.dispatcher = config.dispatcher;
    this.resolvers = config.resolvers || resolvers;
  }

  get sender() {
    return "propertyEntityResolver";
  }

  isValid() {
    return this.isValidProperty || this.isValidResolvers;
  }

  get isValidProperty() {
    return isObjectType(this.property);
  }

  get isValidResolvers() {
    return isObjectType(this.resolvers);
  }

  validate() {
    this.validateResolvers() && this.validateProperty();
  }

  validateResolvers() {
    !this.isValidResolvers &&
      this.error(
        "resolve",
        "Invalid resolvers. Must be an object, where each entry is a resolver function"
      );
  }

  validateResolver(resolver, key) {
    !isFunctionType(resolver) &&
      this.error(
        "resolve",
        `Invalid resolver [${key}]. Must be a function. Was ${typeof resolver}`
      );
    return true;
  }

  validateProperty() {
    !isValidProperty &&
      this.error(
        "resolve",
        `Invalid property. Must be an object. Was ${typeof this.property}`
      );
    return true;
  }

  resolveMap(resolvePropType) {
    this.validate();
    resolvePropType = resolvePropType || this.resolvePropType.bind(this);
    const { resolvers } = this;
    const resolved = Object.keys(resolvers).reduce((acc, key) => {
      const resolver = resolvers[key];
      this.validateResolver(resolver, key);
      const propType = resolver({
        property: this.property,
        config: this.config
      });
      if (!propType) {
        return acc;
      }
      const resultKey = propType ? propType.kind : undefined;
      !isStringType(resultKey) &&
        this.error(
          "resolveMap",
          `resolved entity has invalid or missing kind ${resolved.kind}`
        );
      const value = resolvePropType(propType);
      assignAt(acc, resultKey, value);
      return acc;
    }, {});
    return resolved;
  }

  resolvePropType(propType) {
    return this.resolveShape(propType);
  }

  resolve() {
    const entity = this.resolveToEntity();
    this.onEntity(entity);
    return entity;
  }

  resolveToEntity() {
    const map = this.resolveMap();
    const entity = this.selectEntity(map);
    return entity;
  }

  resolveType() {
    const entity = this.resolveToEntity();
    return this.entityType(entity);
  }

  entityType(entity) {
    return entity.type.resolved;
  }

  resolveShape(propType) {
    return propType.shape
      ? propType.shape
      : this.error("shapeResolver", "missing shape", propType);
  }

  selectEntity(map) {
    const keys = Object.keys(map);
    const firstKey = keys[0];
    if (map.primitive && map.enum) {
      return { type: "enum", value: map.enum };
    }
    const values = Object.values(map);
    const resultCount = values.length || 0;
    resultCount === 0 &&
      this.error(
        "selectEntity",
        "no results can be selected from result map",
        map
      );

    const firstValue = values[0];
    return resultCount === 1
      ? { type: firstKey, value: firstValue }
      : this.onSelectConflict({ map, values, keys });
  }

  onSelectConflict({ map, values, keys }) {
    this.error("selectEntity", `conflicting result: ${keys.join(", ")}`, map);
  }

  onEntity(entity) {
    this.dispatch({
      payload: {
        ...entity
      }
    });
  }

  dispatch({ payload }) {
    const event = {
      sender: this.sender,
      payload: payload
    };
    if (!this.dispatcher) {
      this.warn("dispatch", "missing dispatcher");
      return;
    }

    this.dispatcher.dispatch(event);
  }
}

module.exports = {
  createPropertyEntityResolver,
  PropertyEntityResolver
};

const { resolvers } = require("./types");
