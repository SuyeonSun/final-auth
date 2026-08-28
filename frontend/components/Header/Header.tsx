"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PUBLIC_ROUTES } from "@/constants/auth";
import { useMeQuery } from "@/hooks/user/useMe";

import styles from "./Header.module.scss";

export function Header() {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);
  const { data: user, isPending } = useMeQuery(!isPublicRoute);

  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/">
        Final Auth
      </Link>

      {isPending ? null : user ? (
        <span className={styles.user}>{user.username}님</span>
      ) : (
        <Link className={styles.loginLink} href="/login">
          로그인
        </Link>
      )}
    </header>
  );
}
