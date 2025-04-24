import { useState } from "react";
import { apiFetch } from "@/lib/apiClient";

export interface ScrapedJob {
  id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  date_posted?: string;
  source?: string;
}

export interface ScrapingResults {
  jobs: ScrapedJob[];
  metadata?: {
    total: number;
    source: string;
    query?: string;
  };
}

export function useScraping(token?: string | null) {
  const [results, setResults] = useState<ScrapingResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setLoading(true);
    setError(null);
    setResults(null);
  };

  const scrapeUrl = async (url: string) => {
    resetState();
    
    try {
      const { data, error: apiError } = await apiFetch("/api/scrape/url", {
        method: "POST", 
        body: { url }, 
        token 
      });
      
      setLoading(false);
      
      if (apiError) {
        setError(apiError);
        return null;
      }
      
      if (data) {
        setResults(data);
      }
      
      return data;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      return null;
    }
  };

  const scrapeBatch = async (keywords: string) => {
    resetState();
    
    try {
      const { data, error: apiError } = await apiFetch("/api/scrape/batch", {
        method: "POST", 
        body: { keywords }, 
        token 
      });
      
      setLoading(false);
      
      if (apiError) {
        setError(apiError);
        return null;
      }
      
      if (data) {
        setResults(data);
      }
      
      return data;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      return null;
    }
  };

  const saveJobs = async (jobs: ScrapedJob[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await apiFetch("/api/scrape/save", {
        method: "POST", 
        body: { jobs }, 
        token 
      });
      
      setLoading(false);
      
      if (apiError) {
        setError(apiError);
        return null;
      }
      
      return data;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      return null;
    }
  };

  return { 
    results, 
    loading, 
    error, 
    scrapeUrl, 
    scrapeBatch, 
    saveJobs, 
    setResults 
  };
}
