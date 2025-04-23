"use client"

import { useAuth } from "@/hooks/use-auth"
import { TalentDashboard } from "@/components/talent-dashboard"
import { CompanyDashboard } from "@/components/company-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.username}! Here's an overview of your account.</p>
      </div>

      {user.role === "talent" ? <TalentDashboard /> : <CompanyDashboard />}
    </div>
  )
}
