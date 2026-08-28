import type { EvChargingCompany } from "@/features/ev/ev.types";
import { fetchProtected } from "@/lib/auth/dal";

import styles from "./ev.module.scss";

const STATUS_LABEL: Record<EvChargingCompany["status"], string> = {
  ACTIVE: "운영중",
  INACTIVE: "중단",
};

export default async function EvPage() {
  const companies = await fetchProtected<EvChargingCompany[]>(
    "api/ev/companies",
  );

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>EV Charging</p>
        <h1>충전기 회사 목록</h1>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>회사명</th>
              <th>충전기 수</th>
              <th>지역</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.chargerCount}</td>
                <td>{company.region}</td>
                <td>{STATUS_LABEL[company.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
