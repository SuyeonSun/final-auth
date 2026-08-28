import Link from "next/link";

import { LoginForm } from "./LoginForm";
import styles from "./login.module.scss";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header>
          <p className={styles.eyebrow}>Final Auth</p>
          <h1>로그인</h1>
          <p>계정 이메일과 비밀번호를 입력해 주세요.</p>
        </header>
        <LoginForm />
        <p className={styles.registerLink}>
          계정이 없나요? <Link href="/register">회원가입</Link>
        </p>
      </section>
    </main>
  );
}
