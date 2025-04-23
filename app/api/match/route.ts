import { type NextRequest, NextResponse } from "next/server"

// This would be a real API route that calls the Flask backend
// For now, we'll just mock the response

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real implementation, this would call the Flask API
    // For demo purposes, we'll just return mock data

    // Check if we're matching a project to jobs or a job to projects
    if (body.githubUrl && body.jobDescriptions) {
      // Project to jobs
      return NextResponse.json({
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
      })
    } else if (body.jobDescription && body.githubUrls) {
      // Job to projects
      return NextResponse.json({
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
      })
    } else {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
