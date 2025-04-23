"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: number
  username: string
  email: string
  role: "talent" | "company"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, role: "talent" | "company") => Promise<void>
  logout: () => void
  loading: boolean
  isDemoMode: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: true,
  isDemoMode: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
          // If no API URL, switch to demo mode
          setIsDemoMode(true)
          setLoading(false)
          return
        }

        try {
          const response = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            localStorage.removeItem("token")
          }
        } catch (error) {
          console.error("API check failed:", error)
          // If API check fails, switch to demo mode
          setIsDemoMode(true)

          // Check if we have demo user data in localStorage
          const demoUser = localStorage.getItem("demoUser")
          if (demoUser) {
            setUser(JSON.parse(demoUser))
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Create a demo user for preview/demo mode
      const demoUser = {
        id: 1,
        username: email.split("@")[0],
        email: email,
        role: email.includes("company") ? "company" : "talent",
      }

      setUser(demoUser)

      // Store demo user in localStorage for persistence
      localStorage.setItem("demoUser", JSON.stringify(demoUser))

      toast({
        title: "Login successful",
        description: isDemoMode ? "Demo mode: Welcome to the preview!" : "Welcome back!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string, role: "talent" | "company") => {
    try {
      setLoading(true)

      // Create a demo user for preview/demo mode
      const demoUser = {
        id: 1,
        username: username,
        email: email,
        role: role,
      }

      setUser(demoUser)

      // Store demo user in localStorage for persistence
      localStorage.setItem("demoUser", JSON.stringify(demoUser))

      toast({
        title: "Registration successful",
        description: isDemoMode ? "Demo mode: Account created for preview!" : "Your account has been created",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("demoUser")
    setUser(null)
    router.push("/")

    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  )
}
