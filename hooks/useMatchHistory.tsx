import { useState, useEffect } from "react";
import { apiFetch } from "../lib/apiClient";

export interface Match {
  id: string;
  date: string;
  result: string;
  opponent: string;
  score: string;
  // Add other match properties as needed
}

export function useMatchHistory(token?: string | null) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await apiFetch<{ matches: Match[] }>("/api/matches", {
        token,
      });
      
      if (apiError) {
        setError(apiError);
      } else if (data?.matches) {
        setMatches(data.matches);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch match history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMatches();
    }
  }, [token]);

  return {
    matches,
    loading,
    error,
    fetchMatches,
    setMatches,
  };
}
