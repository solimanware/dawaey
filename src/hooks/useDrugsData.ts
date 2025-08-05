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
  
  const loadDrugsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("🔄 Starting to load drugs data...");
      
      // Try dynamic loading first
      try {
        const asset = Asset.fromModule(require("../../assets/data/drugs.json"));
        console.log("📦 Asset created:", asset.uri);
        
        await asset.downloadAsync();
        console.log("⬇️ Asset downloaded:", asset.localUri);
        
        if (!asset.localUri) {
          throw new Error("Asset local URI is null after download");
        }
        
        const jsonString = await FileSystem.readAsStringAsync(asset.localUri);
        console.log("📖 File read successfully, length:", jsonString.length);
        
        const jsonData = JSON.parse(jsonString);
        console.log("✅ JSON parsed successfully, items count:", jsonData.length);
        
        setRawDrugsData(jsonData);
        return;
      } catch (dynamicLoadError) {
        console.warn("⚠️ Dynamic loading failed, trying fallback:", dynamicLoadError);
        
        // Fallback to direct import (this will increase bundle size but ensures it works)
        const fallbackData = require("../../assets/data/drugs.json");
        console.log("✅ Fallback loading successful, items count:", fallbackData.length);
        
        setRawDrugsData(fallbackData);
      }
    } catch (err) {
      console.error("❌ Failed to load drugs data:", err);
      
      // Improved error handling to avoid "[object Object]" display
      let errorMessage = "Failed to load medications database";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object") {
        // Try to extract meaningful error information
        errorMessage = err.toString?.() || JSON.stringify(err, null, 2) || "Unknown error occurred";
      }
      
      // Fallback to a user-friendly message if error is too technical
      if (errorMessage.includes("[object Object]") || errorMessage.length > 200) {
        errorMessage = "Unable to load medications database. Please check your internet connection and try restarting the app.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const retryLoad = () => {
    setError(null);
    setIsLoading(true);
    loadDrugsData();
  };

  useEffect(() => {
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

  return { drugs, isLoading, error, retryLoad };
};
