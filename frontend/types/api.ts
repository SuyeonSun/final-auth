export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

export type ValidationErrorData = {
  fieldErrors: Record<string, string[]>;
};
