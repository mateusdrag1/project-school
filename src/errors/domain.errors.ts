export class ResourceNotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "ResourceNotFoundError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message = "Credenciais inválidas") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Insufficient permissions") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class EmailAlreadyInUseError extends Error {
  constructor(message = "Email already in use") {
    super(message);
    this.name = "EmailAlreadyInUseError";
  }
}
