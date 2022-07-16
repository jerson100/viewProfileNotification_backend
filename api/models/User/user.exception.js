class UserCreateException extends Error {
  constructor(msg = "No se pudo crear el usuario", status = 400) {
    super(msg);
    this.status = status;
    this.name = "UserCreateException";
  }
}

module.exports = UserCreateException;
