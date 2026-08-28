"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/features/auth/register/register.schema";
import { useRegisterMutation } from "@/hooks/register/useRegister";

import styles from "./register.module.scss";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      useremail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    registerMutation.mutate(
      {
        username: values.username,
        useremail: values.useremail,
        password: values.password,
      },
      {
      onSuccess: () => {
        router.replace("/login?registered=true");
      },
      },
    );
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="username">이름</label>
        <input
          id="username"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? "username-error" : undefined}
          {...register("username")}
        />
        {errors.username ? (
          <p className={styles.error} id="username-error">
            {errors.username.message}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="useremail">이메일</label>
        <input
          id="useremail"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.useremail)}
          aria-describedby={errors.useremail ? "useremail-error" : undefined}
          {...register("useremail")}
        />
        {errors.useremail ? (
          <p className={styles.error} id="useremail-error">
            {errors.useremail.message}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password ? (
          <p className={styles.error} id="password-error">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword ? "confirm-password-error" : undefined
          }
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className={styles.error} id="confirm-password-error">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      {registerMutation.error ? (
        <p className={styles.submitError} role="alert">
          {registerMutation.error.message}
        </p>
      ) : null}

      <button type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? "가입 중..." : "회원가입"}
      </button>
    </form>
  );
}
