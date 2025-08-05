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

const FILE_NAME = "drugs.json";
const LOCAL_JSON_PATH = `${FileSystem.documentDirectory}${FILE_NAME}`;

const loadDrugsJson = async (): Promise<Drug[]> => {
  try {
    console.log("📋 Loading drugs data...");
    
    // Check if file already copied to local storage
    const fileInfo = await FileSystem.getInfoAsync(LOCAL_JSON_PATH);
    if (!fileInfo.exists) {
      console.log("📥 Copying drugs data to local storage...");
      
      // Copy from asset to documentDirectory for faster access
      const asset = Asset.fromModule(require("../../assets/data/drugs.json"));
      await asset.downloadAsync(); // Ensures it's available

      if (!asset.localUri) {
        throw new Error("Asset URI not available");
      }

      await FileSystem.copyAsync({
        from: asset.localUri,
        to: LOCAL_JSON_PATH,
      });
      
      console.log("✅ Drugs data cached locally");
    } else {
      console.log("📂 Using cached drugs data");
    }

    // Read from local cached file for better performance
    const jsonString = await FileSystem.readAsStringAsync(LOCAL_JSON_PATH);
    const data = JSON.parse(jsonString);

    console.log(`📊 Loaded ${data.length} drugs from cache`);
    return data as Drug[];
  } catch (error) {
    console.error("❌ Failed to load drugs data", error);
    return [];
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
