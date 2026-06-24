export class AppError extends Error {
  constructor(
    public readonly status: 400 | 401 | 404 | 409 | 500 | 503,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}
