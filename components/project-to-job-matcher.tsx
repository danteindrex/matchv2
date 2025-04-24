"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Github, Briefcase, ArrowRight } from "lucide-react"
import { MatchResult } from "@/components/match-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useMatch } from "@/hooks/useMatch"

export function ProjectToJobMatcher() {
  const [githubUrl, setGithubUrl] = useState("")
  const [jobDescriptions, setJobDescriptions] = useState("")
  const [results, setResults] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Fetch JWT token from localStorage for auth
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined
  const { matchProjectToJobs, loading, error } = useMatch(token)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setResults(null)
    setLocalError(null)

    if (!githubUrl || !jobDescriptions) {
      return
    }

    const jobDescriptionsArray = jobDescriptions
      .split("\n")
      .map((desc) => desc.trim())
      .filter((desc) => desc.length > 0)

    if (jobDescriptionsArray.length === 0) {
      setLocalError("Please enter at least one valid job description.")
      return
    }

    try {
      const data = await matchProjectToJobs(githubUrl, jobDescriptionsArray)
      if (!data || data.error) {
        setLocalError(data?.error || "Failed to get results from the server.")
        setResults(null)
      } else {
        setResults(data)
      }
    } catch (err: any) {
      setLocalError("Network or server error. Please try again.")
      setResults(null)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Match GitHub Project to Jobs</CardTitle>
          <CardDescription>
            Enter your GitHub repository URL and job descriptions to find the best matches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Repository URL</Label>
              <div className="flex items-center space-x-2">
                <Github className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="github-url"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-descriptions">Job Descriptions</Label>
              <div className="flex items-start space-x-2">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-2" />
                <Textarea
                  id="job-descriptions"
                  placeholder="Enter one or more job descriptions to match against..."
                  className="min-h-[200px]"
                  value={jobDescriptions}
                  onChange={(e) => setJobDescriptions(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                You can enter multiple job descriptions separated by line breaks.
              </p>
            </div>

            {submitted && (!githubUrl || !jobDescriptions) && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  { !githubUrl ? "Please enter a GitHub repository URL" : "Please enter at least one job description" }
                </AlertDescription>
              </Alert>
            )}

            {(localError || error) && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{localError || error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Find Matches
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && <MatchResult results={results} type="project-to-job" />}
    </div>
  )
}
