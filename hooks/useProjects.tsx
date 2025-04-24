import { useState } from "react";
import { apiFetch } from "../lib/apiClient";

export interface Project {
  id: number;
  name: string;
  url: string;
  description?: string;
  technologies?: string[];
  role?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export function useProjects(token?: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await apiFetch<{ projects: Project[] }>("/api/talent/projects", { token });
    setLoading(false);
    if (apiError) setError(apiError);
    if (data?.projects) setProjects(data.projects);
  };

  const addProject = async (projectData: Partial<Project>) => {
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await apiFetch("/api/talent/projects", {
      method: "POST",
      body: projectData,
      token
    });
    setLoading(false);
    if (apiError) setError(apiError);
    if (data?.project) setProjects((prev) => [...prev, data.project]);
    return { success: !apiError, project: data?.project };
  };

  const updateProject = async (projectId: number, updates: Partial<Project>) => {
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await apiFetch(`/api/talent/projects/${projectId}`, {
      method: "PATCH",
      body: updates,
      token
    });
    setLoading(false);
    if (apiError) setError(apiError);
    if (data?.project) {
      setProjects((prev) => 
        prev.map((p) => (p.id === projectId ? data.project : p))
      );
    }
    return { success: !apiError, project: data?.project };
  };

  const deleteProject = async (projectId: number) => {
    setLoading(true);
    setError(null);
    const { error: apiError } = await apiFetch(`/api/talent/projects/${projectId}`, {
      method: "DELETE",
      token
    });
    setLoading(false);
    if (apiError) setError(apiError);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    return { success: !apiError };
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    setProjects,
  };
}
