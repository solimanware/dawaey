import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

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

const FILE_NAME = "drugs.json";
const LOCAL_JSON_PATH = `${FileSystem.documentDirectory}${FILE_NAME}`;

const loadDrugsJson = async (): Promise<Drug[]> => {
  return new Promise(async (resolve, reject) => {
    const module = await import("../../assets/data/drugs.json");
    const data: any = module.default;

    if (data.length > 0) {
      resolve(data);
    } else {
      reject(new Error("Failed to load drugs data"));
    }
  });
};

export const useDrugsData = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const drugsData = await loadDrugsJson();
        setDrugs(drugsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load drugs data"
        );
        console.error("Error loading drugs data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    drugs,
    isLoading,
    error,
  };
};
