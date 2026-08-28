import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Final Auth</p>
        <h1>Frontend foundation is ready.</h1>
        <p>Authentication features will be implemented in the next stages.</p>
      </section>
    </main>
  );
}
