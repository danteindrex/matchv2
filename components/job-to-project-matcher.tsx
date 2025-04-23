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

export function JobToProjectMatcher() {
  const [jobDescription, setJobDescription] = useState("")
  const [githubUrls, setGithubUrls] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!jobDescription) {
      setError("Please enter a job description")
      return
    }

    if (!githubUrls) {
      setError("Please enter at least one GitHub repository URL")
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
              repository_name: "modern-react-dashboard",
              repository_url: "https://github.com/username/modern-react-dashboard",
              match_score: 91,
              key_factors: [
                "React.js expertise matches job requirements",
                "State management implementation aligns with position needs",
                "Responsive design demonstrates UI/UX skills mentioned in job",
                "Testing coverage shows quality focus required by position",
              ],
            },
            {
              repository_name: "node-api-service",
              repository_url: "https://github.com/username/node-api-service",
              match_score: 68,
              key_factors: [
                "Backend API development matches job requirements",
                "Database integration shows relevant skills",
                "Limited frontend code compared to full-stack expectations",
                "Authentication implementation aligns with security focus",
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

      {results && <MatchResult results={results} type="job-to-project" />}
    </div>
  )
}
