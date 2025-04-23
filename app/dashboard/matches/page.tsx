"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { Github, Briefcase, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // In a real app, fetch matches from the API
    if (user?.role === "talent") {
      setMatches([
        {
          id: 1,
          jobTitle: "Senior Frontend Developer",
          company: "TechCorp",
          matchScore: 87,
          repository: "modern-react-dashboard",
          keyFactors: [
            "Strong React.js experience matches repository's React usage",
            "TypeScript proficiency evident in project structure",
            "UI/UX focus aligns with job requirements",
            "Missing experience with GraphQL mentioned in job description",
          ],
        },
        {
          id: 2,
          jobTitle: "Full Stack Engineer",
          company: "InnovateSoft",
          matchScore: 72,
          repository: "node-api-service",
          keyFactors: [
            "JavaScript/TypeScript skills match job requirements",
            "Frontend framework experience aligns with position needs",
            "Limited backend code in repository compared to job expectations",
            "CI/CD implementation shows DevOps knowledge required by job",
          ],
        },
      ])
    } else {
      setMatches([
        {
          id: 1,
          username: "johndoe",
          repository: "modern-react-dashboard",
          repositoryUrl: "https://github.com/johndoe/modern-react-dashboard",
          jobTitle: "Senior Frontend Developer",
          matchScore: 91,
          keyFactors: [
            "React.js expertise matches job requirements",
            "State management implementation aligns with position needs",
            "Responsive design demonstrates UI/UX skills mentioned in job",
            "Testing coverage shows quality focus required by position",
          ],
        },
        {
          id: 2,
          username: "janedoe",
          repository: "node-api-service",
          repositoryUrl: "https://github.com/janedoe/node-api-service",
          jobTitle: "Full Stack Engineer",
          matchScore: 84,
          keyFactors: [
            "Backend API development matches job requirements",
            "Database integration shows relevant skills",
            "Authentication implementation aligns with security focus",
            "Limited frontend code compared to full-stack expectations",
          ],
        },
      ])
    }
  }, [user])

  if (!user) return null

  const isTalent = user.role === "talent"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isTalent ? "Job Matches" : "Talent Matches"}</h1>
        <p className="text-muted-foreground">
          {isTalent
            ? "View job opportunities that match your GitHub projects."
            : "View talent that matches your job listings."}
        </p>
      </div>

      <div className="space-y-6">
        {matches.map((match) => (
          <Card key={match.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {isTalent ? (
                      <>
                        <Briefcase className="h-5 w-5" />
                        {match.jobTitle}
                      </>
                    ) : (
                      <>
                        <Github className="h-5 w-5" />
                        {match.repository}
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">{isTalent ? match.company : match.username}</CardDescription>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">{match.matchScore}%</div>
                  <Progress value={match.matchScore} className="w-24 mt-2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Match Details</h3>
                  <div className="flex items-center gap-2">
                    {isTalent ? (
                      <>
                        <Badge variant="outline">Repository: {match.repository}</Badge>
                      </>
                    ) : (
                      <>
                        <Badge variant="outline">Job: {match.jobTitle}</Badge>
                        <a
                          href={match.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Key Factors</h3>
                  <ul className="space-y-1">
                    {match.keyFactors.map((factor: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Badge
                          variant={factor.includes("Missing") || factor.includes("Limited") ? "outline" : "default"}
                          className="mt-0.5"
                        >
                          {factor.includes("Missing") || factor.includes("Limited") ? "-" : "+"}
                        </Badge>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button asChild>
                  <Link href={`/dashboard/matches/${match.id}`}>View Full Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
