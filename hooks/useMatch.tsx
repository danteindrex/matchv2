import { useState } from "react";
import { apiFetch } from "../lib/apiClient";

export function useMatch(token?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matchProjectToJobs = async (githubUrl: string, jobDescriptions: string[]) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await apiFetch(
      "/api/match",
      {
        method: "POST",
        body: { githubUrl, jobDescriptions },
        token,
      }
    );
    
    setLoading(false);
    setError(apiError ?? null);
    return data;
  };

  const matchJobToProjects = async (jobDescription: string, githubUrls: string[]) => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await apiFetch(
      "/api/match",
      {
        method: "POST",
        body: { jobDescription, githubUrls },
        token,
      }
    );
    
    setLoading(false);
    setError(apiError ?? null);
    return data;
  };

  return {
    matchProjectToJobs,
    matchJobToProjects,
    loading,
    error,
  };
}
