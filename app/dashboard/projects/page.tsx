"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Plus, Trash2, RefreshCw, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [newProjectUrl, setNewProjectUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    // In a real app, fetch projects from the API
    setProjects([
      {
        id: 1,
        name: "modern-react-dashboard",
        url: "https://github.com/johndoe/modern-react-dashboard",
        description: "A modern dashboard built with React and TypeScript",
        languages: ["TypeScript", "React", "CSS"],
        lastAnalyzed: "2023-04-15T10:30:00Z",
      },
      {
        id: 2,
        name: "node-api-service",
        url: "https://github.com/johndoe/node-api-service",
        description: "RESTful API service built with Node.js and Express",
        languages: ["JavaScript", "Node.js", "Express"],
        lastAnalyzed: "2023-04-10T14:45:00Z",
      },
      {
        id: 3,
        name: "python-data-analysis",
        url: "https://github.com/johndoe/python-data-analysis",
        description: "Data analysis tools and notebooks using Python",
        languages: ["Python", "Jupyter", "Pandas"],
        lastAnalyzed: "2023-04-05T09:15:00Z",
      },
    ])
  }, [])

  const handleAddProject = () => {
    if (!newProjectUrl) return

    setIsLoading(true)

    // In a real app, send this to the API
    setTimeout(() => {
      const newId = projects.length + 1
      const urlParts = newProjectUrl.split("/")
      const repoName = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]

      setProjects([
        ...projects,
        {
          id: newId,
          name: repoName,
          url: newProjectUrl,
          description: "Repository description will be fetched from GitHub",
          languages: ["Loading..."],
          lastAnalyzed: new Date().toISOString(),
        },
      ])

      setNewProjectUrl("")
      setIsLoading(false)

      toast({
        title: "Project added",
        description: "Your GitHub project has been added successfully",
      })
    }, 1500)
  }

  const handleRemoveProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id))

    toast({
      title: "Project removed",
      description: "Your GitHub project has been removed",
    })
  }

  const handleRefreshProject = (id: number) => {
    toast({
      title: "Project refreshed",
      description: "Your GitHub project is being re-analyzed",
    })
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GitHub Projects</h1>
          <p className="text-muted-foreground">Connect your GitHub repositories to find matching job opportunities.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="GitHub repository URL"
            value={newProjectUrl}
            onChange={(e) => setNewProjectUrl(e.target.value)}
            className="w-80"
          />
          <Button onClick={handleAddProject} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  {project.name}
                </CardTitle>
                <CardDescription className="mt-1.5">{project.description}</CardDescription>
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.languages.map((lang: string, i: number) => (
                  <Badge key={i} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Last analyzed: {new Date(project.lastAnalyzed).toLocaleDateString()}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleRefreshProject(project.id)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleRemoveProject(project.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
