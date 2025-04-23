import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Github, Briefcase, ExternalLink } from "lucide-react"

interface MatchResultProps {
  results: {
    matches: Array<{
      job_title?: string
      company?: string
      repository_name?: string
      repository_url?: string
      match_score: number
      key_factors: string[]
    }>
  }
  type: "project-to-job" | "job-to-project"
}

export function MatchResult({ results, type }: MatchResultProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Match Results</h2>

      {results.matches.map((match, index) => {
        const isProjectToJob = type === "project-to-job"
        const scoreColor =
          match.match_score >= 80
            ? "text-green-500 dark:text-green-400"
            : match.match_score >= 60
              ? "text-yellow-500 dark:text-yellow-400"
              : "text-red-500 dark:text-red-400"

        return (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-4">
              {isProjectToJob ? (
                <>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>{match.job_title}</CardTitle>
                  </div>
                  <CardDescription>{match.company}</CardDescription>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="flex items-center gap-2">
                      {match.repository_name}
                      <a
                        href={match.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    </CardTitle>
                  </div>
                  <CardDescription>{match.repository_url}</CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="pb-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Match Score</span>
                  <span className={`text-lg font-bold ${scoreColor}`}>{match.match_score}%</span>
                </div>
                <Progress value={match.match_score} className="h-2" />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Key Factors</h4>
                <ul className="space-y-2">
                  {match.key_factors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
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
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
