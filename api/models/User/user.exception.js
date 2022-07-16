class UserCreateException extends Error {
  constructor(msg = "No se pudo crear el usuario", status = 400) {
    super(msg);
    this.status = status;
    this.name = "UserCreateException";
  }
}

class AuthenticationUserException extends Error {
  constructor(msg = "Usuario o contraseña incorrecta", status = 401) {
    super(msg);
    this.status = status;
    this.name = "AuthenticationUserException";
  }
}

module.exports = { UserCreateException, AuthenticationUserException };
