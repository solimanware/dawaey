import { useState, useEffect } from "react";
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

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

const loadDrugsJson = async (): Promise<Drug[]> => {
  try {
    const asset = Asset.fromModule(require('../../assets/data/drugs.json'));
    await asset.downloadAsync(); // Makes sure it's on device
    const json = await FileSystem.readAsStringAsync(asset.localUri || '');
    const data = JSON.parse(json);
    
    // Transform the data to ensure compatibility and add missing fields
    return (data as any[]).map(
      (drug): Drug => ({
        ...drug,
      })
    );
  } catch (error) {
    console.error('Failed to load drugs data:', error);
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
        setError(err instanceof Error ? err.message : 'Failed to load drugs data');
        console.error('Error loading drugs data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { 
    drugs, 
    isLoading, 
    error 
  };
};
