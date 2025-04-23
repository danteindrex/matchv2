import { Code, Briefcase, Users, Database, Search, BarChart } from "lucide-react"

export function LandingFeatures() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything you need to match talent with opportunities
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform uses AI to analyze GitHub projects and job descriptions, providing accurate matching scores
              and detailed explanations.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">GitHub Integration</h3>
            <p className="text-center text-muted-foreground">
              Connect your GitHub account and let our AI analyze your repositories to find matching job opportunities.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Job Matching</h3>
            <p className="text-center text-muted-foreground">
              Our AI analyzes job descriptions and matches them with GitHub projects based on skills, technologies, and
              complexity.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Role-Based Access</h3>
            <p className="text-center text-muted-foreground">
              Different interfaces for talent and companies, ensuring a tailored experience for each user type.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Job Database</h3>
            <p className="text-center text-muted-foreground">
              Access a growing database of job opportunities, both manually added and automatically scraped from the
              web.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Batch Processing</h3>
            <p className="text-center text-muted-foreground">
              Process multiple GitHub repositories or job descriptions at once for efficient matching at scale.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Detailed Analytics</h3>
            <p className="text-center text-muted-foreground">
              Get comprehensive matching scores and detailed explanations of the factors that influenced the matching
              process.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
