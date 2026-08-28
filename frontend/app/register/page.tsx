import Link from "next/link";

import { RegisterForm } from "./RegisterForm";
import styles from "./register.module.scss";

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header>
          <p className={styles.eyebrow}>Final Auth</p>
          <h1>회원가입</h1>
          <p>계정에 사용할 정보를 입력해 주세요.</p>
        </header>
        <RegisterForm />
        <p className={styles.loginLink}>
          이미 계정이 있나요? <Link href="/login">로그인</Link>
        </p>
      </section>
    </main>
  );
}
