export type EvChargingCompany = {
  id: string;
  name: string;
  chargerCount: number;
  region: string;
  status: "ACTIVE" | "INACTIVE";
};
