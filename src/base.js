class Base {
  constructor(config = {}) {
    this.config = config;
    this.log = config.log || console.log;
    this.logErr = config.error || console.error;
    this.warnEnabled = config.warn === true;
  }

  message() {
    return config.messages[this.key] || config.messages[this.type] || {};
  }

  errMessage(errKey = "default") {
    return this.message[errKey] || "error";
  }

  warn(name, msg) {
    if (!this.warnEnabled) return;
    const errMsg = `WARNING [${this.constructor.name}:${name}] ${msg}`;
    this.log(errMsg);
  }

  error(name, msg, value) {
    const errMsg = `ERROR [${this.constructor.name}:${name}] ${msg}`;
    value ? this.logErr(errMsg, { value }) : this.logErr(errMsg);
    throw new Error(errMsg);
  }
}

module.exports = {
  Base
};
