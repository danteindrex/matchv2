"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Plus, Trash2, RefreshCw, ExternalLink, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useProjects } from "@/hooks/use-projects"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProjectsPage() {
  const [newProjectUrl, setNewProjectUrl] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const { user } = useAuth()
  const { 
    projects, 
    loading, 
    error, 
    fetchProjects, 
    addProject, 
    deleteProject, 
    refreshProject 
  } = useProjects()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleAddProject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newProjectUrl || isAdding) return

    setIsAdding(true)
    try {
      await addProject(newProjectUrl)
      setNewProjectUrl("")
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveProject = async (id: number) => {
    await deleteProject(id)
  }

  const handleRefreshProject = async (id: number) => {
    await refreshProject(id)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GitHub Projects</h1>
          <p className="text-muted-foreground">Connect your GitHub repositories to find matching job opportunities.</p>
        </div>
        <form onSubmit={handleAddProject} className="flex items-center gap-2">
          <Input
            placeholder="GitHub repository URL"
            value={newProjectUrl}
            onChange={(e) => setNewProjectUrl(e.target.value)}
            className="w-full md:w-80"
            required
          />
          <Button type="submit" disabled={isAdding || !newProjectUrl.trim()}>
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </>
            )}
          </Button>
        </form>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && projects.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <Github className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
          <p className="mt-2 text-muted-foreground">
            Add your first GitHub project to get started
          </p>
        </div>
      ) : (
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRefreshProject(project.id)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRemoveProject(project.id)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
