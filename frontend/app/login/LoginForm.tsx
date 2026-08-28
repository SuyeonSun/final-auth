"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  loginSchema,
  type LoginRequest,
} from "@/features/auth/login/login.schema";
import { useLoginMutation } from "@/hooks/login/useLogin";

import styles from "./login.module.scss";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      useremail: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.replace("/");
        router.refresh();
      },
    });
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
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
          autoComplete="current-password"
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

      {loginMutation.error ? (
        <p className={styles.submitError} role="alert">
          {loginMutation.error.message}
        </p>
      ) : null}

      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
