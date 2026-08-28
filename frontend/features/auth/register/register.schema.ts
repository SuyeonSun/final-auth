import { z } from "zod";

const registerFields = {
  username: z
    .string()
    .trim()
    .min(2, "이름은 2자 이상 입력해 주세요.")
    .max(30, "이름은 30자 이하로 입력해 주세요."),
  useremail: z
    .string()
    .trim()
    .min(1, "이메일을 입력해 주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상 입력해 주세요.")
    .max(72, "비밀번호는 72자 이하로 입력해 주세요."),
};

export const registerRequestSchema = z.object(registerFields);

export const registerFormSchema = z
  .object({
    ...registerFields,
    confirmPassword: z.string().min(1, "비밀번호를 다시 입력해 주세요."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
