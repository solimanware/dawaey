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
      console.log("🔍 Loading asset from bundle...");

      // First try to get the asset using bundleDirectory
      let sourceUri: string;
      try {
        const asset = Asset.fromURI(
          FileSystem.bundleDirectory + "assets/data/drugs.json"
        );
        await asset.downloadAsync();
        sourceUri = asset.localUri || asset.uri;
        console.log("📁 Asset loaded from bundle:", sourceUri);
      } catch (bundleError) {
        console.warn("⚠️ Bundle method failed, trying alternative...");
        // Fallback: try with module require
        try {
          const asset = Asset.fromModule(
            require("../../assets/data/drugs.json")
          );
          await asset.downloadAsync();
          if (!asset.localUri) {
            throw new Error("Asset localUri not available");
          }
          sourceUri = asset.localUri;
          console.log("📁 Asset loaded via module:", sourceUri);
        } catch (moduleError) {
          throw new Error(
            `Both asset loading methods failed: ${bundleError}, ${moduleError}`
          );
        }
      }

      // Check if source file is actually readable before copying
      try {
        const sourceInfo = await FileSystem.getInfoAsync(sourceUri);
        console.log("📋 Source file info:", sourceInfo);
        
        if (!sourceInfo.exists) {
          throw new Error("Source file does not exist");
        }
        
        // Try to copy the file
        await FileSystem.copyAsync({
          from: sourceUri,
          to: LOCAL_JSON_PATH,
        });
        
        console.log("✅ Drugs data cached locally via copy");
      } catch (copyError) {
        console.warn("⚠️ Copy failed, trying direct read/write...", copyError);
        
        // Fallback: read from asset and write to local file
        try {
          const jsonContent = await FileSystem.readAsStringAsync(sourceUri);
          await FileSystem.writeAsStringAsync(LOCAL_JSON_PATH, jsonContent);
          console.log("✅ Drugs data cached locally via read/write");
        } catch (readWriteError) {
          throw new Error(`Both copy and read/write failed: ${copyError}, ${readWriteError}`);
        }
      }
    } else {
      console.log("📂 Using cached drugs data");
    }

    // Read from local cached file for better performance
    const jsonString = await FileSystem.readAsStringAsync(LOCAL_JSON_PATH);
    const data = JSON.parse(jsonString);

    console.log(`📊 Loaded ${data.length} drugs from cache`);
    return data as Drug[];
  } catch (error) {
    console.error("❌ Failed to load drugs data:", error);
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
