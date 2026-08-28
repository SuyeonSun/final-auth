import ky from "ky";

export const browserApi = ky.create({
  credentials: "same-origin",
  headers: {
    Accept: "application/json",
  },
  retry: 0,
  throwHttpErrors: false,
  timeout: 15_000,
});
