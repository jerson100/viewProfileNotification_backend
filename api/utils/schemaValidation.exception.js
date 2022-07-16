class SchemaValidationError extends Error {
  constructor(
    msg = "Ocurrió un error en la solicitud, vuelva a intentarlo",
    status = 400
  ) {
    super(msg);
    this.msg = msg;
    this.status = status;
    this.name = "SchemaValidationError";
  }
}

module.exports = {
  SchemaValidationError,
};
