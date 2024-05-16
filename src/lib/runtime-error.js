export class RuntimeMsgrError extends Error {
  constructor(message, code, origin?) {
    super(message);
    this.code = code;
    this.origin = origin;

    Object.setPrototypeOf(this, RuntimeMsgrError.prototype);
  }
}
