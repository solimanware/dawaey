import { Asset } from "expo-asset";
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

export const loadDrugsData = async (): Promise<any> => {
  try {
    const asset = Asset.fromModule(require("../../assets/data/drugs.txt"));
    await asset.downloadAsync();

    const fileUri = asset.localUri || asset.uri;

    if (!fileUri) throw new Error("Invalid localUri");

    const content = await FileSystem.readAsStringAsync(fileUri);
    const data = JSON.parse(content); // This still gives you the JSON

    return data;
  } catch (error) {
    console.error("❌ Failed to load drugs data:", error);
    return null;
  }
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
        const drugsData = await loadDrugsData();

        if (drugsData === null) {
          setError("Failed to load drugs data");
          setDrugs([]);
        } else {
          // Transform the data to ensure compatibility and add missing fields
          const transformedDrugs = (drugsData as any[]).map(
            (drug): Drug => ({
              ...drug,
            })
          );
          setDrugs(transformedDrugs);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load drugs data"
        );
        console.error("Error loading drugs data:", err);
        setDrugs([]);
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
