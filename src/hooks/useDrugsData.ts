import { useMemo } from "react";
import drugsData from "../../assets/data/drugs.json";

export type Drug = {
  id: number;
  type: string;
  activeingredient: string;
  company: string;
  group: string;
  tradename: string;
  price: string;
  form?: string;
};

export const useDrugsData = () => {
  const drugs = useMemo(() => {
    // Transform the data to ensure compatibility and add missing fields
    return (drugsData as any[]).map(
      (drug): Drug => ({
        ...drug,
      })
    );
  }, []);

  return { drugs };
};
