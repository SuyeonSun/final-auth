"use client";

import Link from "next/link";

import { useMeQuery } from "@/hooks/user/useMe";

import styles from "./Header.module.scss";

export function Header() {
  const { data: user, isPending } = useMeQuery();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link className={styles.logo} href="/">
          Final Auth
        </Link>

        <nav className={styles.nav}>
          <Link href="/">홈</Link>
          <Link href="/ev">대시보드</Link>
        </nav>
      </div>

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
