import { useState } from "react";
import { apiFetch } from "../lib/apiClient";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true); 
    setError(null);
    const { data, error: apiError } = await apiFetch(
      "/api/auth/login", 
      { method: "POST", body: { email, password } }
    );
    setLoading(false);
    if (apiError) { 
      setError(apiError); 
      return false; 
    }
    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token); 
      setUser(data.user); 
      return true;
    }
    setError("Invalid server response"); 
    return false;
  };

  const register = async (username: string, email: string, password: string, role: string) => {
    setLoading(true); 
    setError(null);
    const { data, error: apiError } = await apiFetch(
      "/api/auth/register", 
      { method: "POST", body: { username, email, password, role } }
    );
    setLoading(false);
    if (apiError) { 
      setError(apiError); 
      return false; 
    }
    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token); 
      setUser(data.user); 
      return true;
    }
    setError("Invalid server response"); 
    return false;
  };

  const getMe = async () => {
    if (!token) return;
    setLoading(true); 
    setError(null);
    const { data, error: apiError } = await apiFetch("/api/auth/me", { token });
    setLoading(false);
    if (apiError) {
      setError(apiError);
    } else {
      setUser(data);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null); 
    setToken(null);
  };

  return { 
    user, 
    token, 
    loading, 
    error, 
    login, 
    register, 
    getMe, 
    logout, 
    setUser 
  };
}
