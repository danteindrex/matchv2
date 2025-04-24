import { type NextRequest, NextResponse } from "next/server"

// Helper: Determine which backend matcher endpoint to use
function getFlaskMatcherEndpoint(body: any): { endpoint: string; error?: string } {
  if (body.githubUrl && body.jobDescriptions) {
    return { endpoint: "project-to-jobs" }
  } else if (body.jobDescription && body.githubUrls) {
    return { endpoint: "job-to-projects" }
  }
  return { endpoint: "", error: "Invalid request parameters" }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get("authorization")
    const { endpoint, error } = getFlaskMatcherEndpoint(body)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    // Forward the request to Flask backend
    const flaskUrl = `${process.env.FLASK_API_URL || 'http://localhost:5000'}/api/match/${endpoint}`
    const flaskRes = await fetch(flaskUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { "Authorization": authHeader } : {}),
      },
      body: JSON.stringify(body),
    })

    // Return the Flask response directly
    const flaskData = await flaskRes.json()
    return NextResponse.json(flaskData, { status: flaskRes.status })
  } catch (error) {
    console.error("Error forwarding to Flask matcher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
