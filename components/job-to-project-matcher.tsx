"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Briefcase, Github, ArrowRight } from "lucide-react"
import { MatchResult } from "@/components/match-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useMatch } from "@/hooks/useMatch"

export function JobToProjectMatcher() {
  const [jobDescription, setJobDescription] = useState("")
  const [githubUrls, setGithubUrls] = useState("")
  const [results, setResults] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Fetch JWT token from localStorage for auth
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined
  const { matchJobToProjects, loading, error } = useMatch(token)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setResults(null)
    setLocalError(null)

    // Validate user input
    if (!jobDescription || !githubUrls) return

    // Prepare URLs as array
    const githubUrlsArray = githubUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    if (githubUrlsArray.length === 0) {
      setLocalError("Please enter at least one valid GitHub repository URL.")
      return
    }

    try {
      // Call real backend
      const data = await matchJobToProjects(jobDescription, githubUrlsArray)
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
          <CardTitle>Match Job to GitHub Projects</CardTitle>
          <CardDescription>Enter a job description and GitHub repository URLs to find the best matches</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <div className="flex items-start space-x-2">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-2" />
                <Textarea
                  id="job-description"
                  placeholder="Enter the job description to match against GitHub projects..."
                  className="min-h-[200px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github-urls">GitHub Repository URLs</Label>
              <div className="flex items-start space-x-2">
                <Github className="h-5 w-5 text-muted-foreground mt-2" />
                <Textarea
                  id="github-urls"
                  placeholder="https://github.com/username/repository1
https://github.com/username/repository2"
                  className="min-h-[150px]"
                  value={githubUrls}
                  onChange={(e) => setGithubUrls(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">Enter one GitHub repository URL per line.</p>
            </div>

            {submitted && (!jobDescription || !githubUrls) && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  { !jobDescription ? "Please enter a job description" : "Please enter at least one GitHub repository URL" }
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

      {results && <MatchResult results={results} type="job-to-project" />}
    </div>
  )
}
