"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Github, Briefcase, BarChart, ArrowRight } from "lucide-react"
import Link from "next/link"

export function TalentDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    matches: 0,
    topMatchScore: 0,
    recentMatches: [],
  })

  useEffect(() => {
    // In a real app, fetch this data from the API
    setStats({
      projects: 3,
      matches: 12,
      topMatchScore: 87,
      recentMatches: [
        {
          id: 1,
          jobTitle: "Senior Frontend Developer",
          company: "TechCorp",
          matchScore: 87,
        },
        {
          id: 2,
          jobTitle: "Full Stack Engineer",
          company: "InnovateSoft",
          matchScore: 72,
        },
      ],
    })
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">GitHub Projects</CardTitle>
          <Github className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.projects}</div>
          <p className="text-xs text-muted-foreground">Connected repositories</p>
          <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
            <Link href="/dashboard/projects">
              Manage Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Job Matches</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.matches}</div>
          <p className="text-xs text-muted-foreground">Potential opportunities</p>
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
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.topMatchScore}%</div>
          <Progress value={stats.topMatchScore} className="mt-2" />
          <p className="mt-2 text-xs text-muted-foreground">Your highest job compatibility</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
          <CardDescription>Your latest job compatibility matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentMatches.map((match: any) => (
              <div key={match.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="font-medium">{match.jobTitle}</div>
                  <div className="text-sm text-muted-foreground">{match.company}</div>
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
