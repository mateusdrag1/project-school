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
