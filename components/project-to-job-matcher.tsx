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

export function ProjectToJobMatcher() {
  const [githubUrl, setGithubUrl] = useState("")
  const [jobDescriptions, setJobDescriptions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!githubUrl) {
      setError("Please enter a GitHub repository URL")
      return
    }

    if (!jobDescriptions) {
      setError("Please enter at least one job description")
      return
    }

    setIsLoading(true)

    try {
      // In a real implementation, this would call the Flask API
      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        const mockResults = {
          matches: [
            {
              job_title: "Senior Frontend Developer",
              company: "TechCorp",
              match_score: 87,
              key_factors: [
                "Strong React.js experience matches repository's React usage",
                "TypeScript proficiency evident in project structure",
                "UI/UX focus aligns with job requirements",
                "Missing experience with GraphQL mentioned in job description",
              ],
            },
            {
              job_title: "Full Stack Engineer",
              company: "InnovateSoft",
              match_score: 72,
              key_factors: [
                "JavaScript/TypeScript skills match job requirements",
                "Frontend framework experience aligns with position needs",
                "Limited backend code in repository compared to job expectations",
                "CI/CD implementation shows DevOps knowledge required by job",
              ],
            },
          ],
        }

        setResults(mockResults)
        setIsLoading(false)
      }, 2000)
    } catch (err) {
      setError("An error occurred while processing your request. Please try again.")
      setIsLoading(false)
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

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
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
