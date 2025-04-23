"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Briefcase, Users, FileSearch, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CompanyDashboard() {
  const [stats, setStats] = useState({
    jobs: 0,
    matches: 0,
    topMatchScore: 0,
    recentMatches: [],
  })

  useEffect(() => {
    // In a real app, fetch this data from the API
    setStats({
      jobs: 5,
      matches: 18,
      topMatchScore: 91,
      recentMatches: [
        {
          id: 1,
          username: "johndoe",
          repository: "modern-react-dashboard",
          matchScore: 91,
        },
        {
          id: 2,
          username: "janedoe",
          repository: "node-api-service",
          matchScore: 84,
        },
      ],
    })
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Job Listings</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.jobs}</div>
          <p className="text-xs text-muted-foreground">Active job postings</p>
          <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
            <Link href="/dashboard/jobs">
              Manage Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Talent Matches</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.matches}</div>
          <p className="text-xs text-muted-foreground">Potential candidates</p>
          <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
            <Link href="/dashboard/matches">
              View Matches
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Match Score</CardTitle>
          <FileSearch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.topMatchScore}%</div>
          <Progress value={stats.topMatchScore} className="mt-2" />
          <p className="mt-2 text-xs text-muted-foreground">Your highest talent compatibility</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
          <CardDescription>Your latest talent compatibility matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentMatches.map((match: any) => (
              <div key={match.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="font-medium">{match.username}</div>
                  <div className="text-sm text-muted-foreground">{match.repository}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{match.matchScore}%</div>
                    <div className="text-sm text-muted-foreground">Match</div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/matches/${match.id}`}>Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
