"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, InfoIcon } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isDemoMode } = useAuth()
  const router = useRouter()
  const [apiAvailable, setApiAvailable] = useState(true)

  useEffect(() => {
    // Check if API is available
    const checkApi = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
          setApiAvailable(false)
          return
        }

        const response = await fetch(`${apiUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        })

        if (!response.ok) {
          const contentType = response.headers.get("content-type")
          if (!contentType || !contentType.includes("application/json")) {
            setApiAvailable(false)
          }
        }
      } catch (error) {
        setApiAvailable(false)
      }
    }

    checkApi()
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6">
          {isDemoMode && (
            <Alert className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                The app is running in demo mode. Your data will not be saved and some features may be limited.
              </AlertDescription>
            </Alert>
          )}
          {!apiAvailable && !isDemoMode && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Connection Error</AlertTitle>
              <AlertDescription>
                Unable to connect to the API server. Some features may not work correctly. Please make sure the backend
                server is running and the NEXT_PUBLIC_API_URL environment variable is set correctly.
              </AlertDescription>
            </Alert>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
