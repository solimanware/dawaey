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
  // Optional fields for backward compatibility
  info?: string;
  form?: string;
  tradenamearabic?: string;
  palette?: string;
};

export const useDrugsData = () => {
  const drugs = useMemo(() => {
    // Transform the data to ensure compatibility and add missing fields
    return (drugsData as any[]).map((drug): Drug => ({
      ...drug,
      id: drug.id,
      form: drug.type, // Map type to form for backward compatibility
      info: drug.info || '',
      tradenamearabic: drug.tradenamearabic || drug.tradename,
      palette: drug.palette || '#2563eb,#3b82f6,#60a5fa', // Default blue palette
    }));
  }, []);

  return { drugs };
};
