import { useEffect, useState, useMemo } from "react";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

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
  const [rawDrugsData, setRawDrugsData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDrugsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load the JSON file dynamically using expo-asset and expo-file-system
        const asset = Asset.fromModule(require("../../assets/data/drugs.json"));
        await asset.downloadAsync();
        
        const jsonString = await FileSystem.readAsStringAsync(asset.localUri!);
        const jsonData = JSON.parse(jsonString);
        
        setRawDrugsData(jsonData);
      } catch (err) {
        console.error("Failed to load drugs data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDrugsData();
  }, []);

  const drugs = useMemo(() => {
    if (!rawDrugsData) return [];
    
    // Transform the data to ensure compatibility and add missing fields
    return rawDrugsData.map(
      (drug): Drug => ({
        ...drug,
      })
    );
  }, [rawDrugsData]);

  return { drugs, isLoading, error };
};
