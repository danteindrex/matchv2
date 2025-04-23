import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Match GitHub Projects with Job Opportunities
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our AI-powered platform analyzes GitHub repositories and job descriptions to find the perfect match for
                developers and companies.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px] xl:h-[550px] rounded-lg bg-muted overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted-foreground/20 z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-background rounded-lg shadow-lg p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 w-32 bg-primary/20 rounded"></div>
                    <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="h-12 bg-muted rounded"></div>
                    <div className="h-24 bg-muted rounded"></div>
                    <div className="h-8 bg-primary/20 rounded w-1/3 mt-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
