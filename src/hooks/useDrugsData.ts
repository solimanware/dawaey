import { useMemo } from "react";
import drugsData from "../../assets/data/drugs.json";

export type Drug = {
  id: string;
  tradename: string;
  activeingredient: string;
  company: string;
  group: string;
  info: string;
  form: string;
  price: number;
  tradenamearabic: string;
  palette: string;
};

export const useDrugsData = () => {
  const drugs = useMemo(() => drugsData as Drug[], []);

  return { drugs };
};
