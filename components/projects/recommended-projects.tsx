import { getRecommendedProjects } from '@/lib/ai/matching'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectCard } from './project-card'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export async function RecommendedProjects() {
  const { projects, error } = await getRecommendedProjects(6)

  if (error || !projects || projects.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Recommended for You</h2>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="relative">
            <ProjectCard project={project} />
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {Math.round(project.match_score * 100)}% Match
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
