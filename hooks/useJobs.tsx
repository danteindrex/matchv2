import { useState } from "react";
import { apiFetch } from "../lib/apiClient";

export interface Job {
  id: number;
  title: string;
  company?: string;
  description: string;
  requirements?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface JobInput {
  title: string;
  company?: string;
  description: string;
  requirements?: string[];
}

export function useJobs(token?: string | null) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await apiFetch<{ jobs: Job[] }>("/api/jobs", {
      token,
    });
    setLoading(false);
    if (apiError) setError(apiError);
    if (data?.jobs) setJobs(data.jobs);
  };

  const getJob = async (jobId: number) => {
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await apiFetch<{ job: Job }>(`/api/jobs/${jobId}`, {
      token,
    });
    setLoading(false);
    if (apiError) setError(apiError);
    return data?.job;
  };

  const addJob = async (jobInput: JobInput) => {
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await apiFetch<{ job: Job }>("/api/jobs", {
      method: "POST",
      body: jobInput,
      token,
    });
    setLoading(false);
    if (apiError) setError(apiError);
    if (data?.job) setJobs((prev) => [...prev, data.job]);
    return data?.job;
  };

  const updateJob = async (jobId: number, jobInput: Partial<JobInput>) => {
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await apiFetch<{ job: Job }>(`/api/jobs/${jobId}`, {
      method: "PUT",
      body: jobInput,
      token,
    });
    setLoading(false);
    if (apiError) setError(apiError);
    if (data?.job) {
      setJobs((prev) => prev.map((job) => (job.id === jobId ? data.job : job)));
    }
    return data?.job;
  };

  const deleteJob = async (jobId: number) => {
    setLoading(true);
    setError(null);
    const { error: apiError } = await apiFetch(`/api/jobs/${jobId}`, {
      method: "DELETE",
      token,
    });
    setLoading(false);
    if (apiError) setError(apiError);
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    getJob,
    addJob,
    updateJob,
    deleteJob,
    setJobs,
  };
}
