"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Plus, Trash2, PenSquare, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    // In a real app, fetch jobs from the API
    setJobs([
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp",
        description: "We're looking for a senior frontend developer with experience in React and TypeScript.",
        requirements: ["React", "TypeScript", "CSS", "5+ years experience"],
        matches: 8,
        createdAt: "2023-04-15T10:30:00Z",
      },
      {
        id: 2,
        title: "Full Stack Engineer",
        company: "InnovateSoft",
        description: "Join our team as a full stack engineer working on exciting projects.",
        requirements: ["JavaScript", "Node.js", "React", "MongoDB"],
        matches: 12,
        createdAt: "2023-04-10T14:45:00Z",
      },
      {
        id: 3,
        title: "Data Scientist",
        company: "DataCorp",
        description: "Looking for a data scientist with experience in Python and machine learning.",
        requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
        matches: 5,
        createdAt: "2023-04-05T09:15:00Z",
      },
    ])
  }, [])

  const handleRemoveJob = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id))

    toast({
      title: "Job removed",
      description: "Your job listing has been removed",
    })
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Listings</h1>
          <p className="text-muted-foreground">Manage your job listings and find matching talent.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {job.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{job.company}</CardDescription>
                </div>
                <Badge className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {job.matches} matches
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">{job.description}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Requirements:</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req: string, i: number) => (
                    <Badge key={i} variant="secondary">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Posted: {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/jobs/${job.id}/edit`}>
                  <PenSquare className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleRemoveJob(job.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
