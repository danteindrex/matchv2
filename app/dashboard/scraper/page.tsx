"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { FileSearch, Globe, Loader2, Check, AlertCircle, ExternalLink } from "lucide-react"

export default function ScraperPage() {
  const [url, setUrl] = useState("")
  const [keywords, setKeywords] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const { toast } = useToast()

  const handleScrape = () => {
    if (!url) return

    setIsLoading(true)
    setResults([])

    // In a real app, this would call the API to start the scraping process
    setTimeout(() => {
      setResults([
        {
          title: "Senior Frontend Developer",
          company: "TechCorp",
          url: "https://example.com/job/123",
          description: "We're looking for a senior frontend developer with experience in React and TypeScript.",
          status: "success",
        },
        {
          title: "Full Stack Engineer",
          company: "InnovateSoft",
          url: "https://example.com/job/456",
          description: "Join our team as a full stack engineer working on exciting projects.",
          status: "success",
        },
      ])

      setIsLoading(false)

      toast({
        title: "Scraping completed",
        description: "Found 2 job listings",
      })
    }, 3000)
  }

  const handleBatchScrape = () => {
    if (!keywords) return

    setIsLoading(true)
    setResults([])

    // In a real app, this would call the API to start the batch scraping process
    setTimeout(() => {
      setResults([
        {
          title: "Senior Frontend Developer",
          company: "TechCorp",
          url: "https://example.com/job/123",
          description: "We're looking for a senior frontend developer with experience in React and TypeScript.",
          status: "success",
        },
        {
          title: "Full Stack Engineer",
          company: "InnovateSoft",
          url: "https://example.com/job/456",
          description: "Join our team as a full stack engineer working on exciting projects.",
          status: "success",
        },
        {
          title: "React Developer",
          company: "WebSolutions",
          url: "https://example.com/job/789",
          description: "Looking for a React developer to join our team.",
          status: "success",
        },
        {
          title: "Frontend Engineer",
          company: "TechStartup",
          url: "https://example.com/job/101",
          description: "Frontend engineer position at a fast-growing startup.",
          status: "error",
          error: "Failed to parse job details",
        },
      ])

      setIsLoading(false)

      toast({
        title: "Batch scraping completed",
        description: "Found 4 job listings (3 successful, 1 failed)",
      })
    }, 5000)
  }

  const handleSaveJobs = () => {
    // In a real app, this would call the API to save the jobs to the database
    toast({
      title: "Jobs saved",
      description: "The scraped job listings have been saved to your account",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Scraper</h1>
        <p className="text-muted-foreground">Scrape job listings from various websites to find matching talent.</p>
      </div>

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="url">Scrape by URL</TabsTrigger>
          <TabsTrigger value="batch">Batch Scraping</TabsTrigger>
        </TabsList>

        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Scrape Job Listings by URL</CardTitle>
              <CardDescription>Enter a URL to scrape job listings from a specific page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <Input placeholder="https://example.com/jobs" value={url} onChange={(e) => setUrl(e.target.value)} />
                <Button onClick={handleScrape} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    "Scrape"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle>Batch Scraping</CardTitle>
              <CardDescription>Enter keywords to scrape job listings from multiple sources.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (one per line)</Label>
                <Textarea
                  id="keywords"
                  placeholder="React Developer
Frontend Engineer
JavaScript Developer"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              <Button onClick={handleBatchScrape} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  "Start Batch Scraping"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Scraping Results</h2>
            <Button onClick={handleSaveJobs}>Save All Jobs</Button>
          </div>

          <div className="space-y-4">
            {results.map((job, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileSearch className="h-5 w-5" />
                        {job.title}
                      </CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </div>
                    {job.status === "success" ? (
                      <div className="flex items-center text-green-500">
                        <Check className="h-5 w-5 mr-1" />
                        <span className="text-sm">Success</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm">Failed</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{job.description}</p>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center"
                  >
                    {job.url}
                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </a>
                  {job.error && <p className="text-sm text-red-500 mt-2">Error: {job.error}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
