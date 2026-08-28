type ApiErrorOptions<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
  cause?: unknown;
};

export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly code: string;
  readonly data: T;

  constructor({ status, code, message, data, cause }: ApiErrorOptions<T>) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
