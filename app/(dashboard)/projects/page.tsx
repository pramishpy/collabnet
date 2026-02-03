import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectsSearchClient } from '@/components/projects/search/projects-search-client'
import { getProjectsWithMatchScores } from './actions'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Discover Projects | CollabNet',
  description: 'Browse research projects looking for collaborators at USM',
}
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { q?: string; skills?: string; status?: string }
}) {
  const supabase = await createClient()

  // Get projects with match scores
  const projects = await getProjectsWithMatchScores({
    q: searchParams.q,
    skills: searchParams.skills,
    status: searchParams.status,
  })

  // Get all unique skills for filter
  const { data: allProjects } = await supabase
    .from('projects')
    .select('required_skills')

  const allSkills = Array.from(
    new Set(
      allProjects?.flatMap((p) => p.required_skills) || []
    )
  ).sort()

  return (
    <div className="min-h-screen p-8 bg-muted/30">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Discover Projects</h1>
            <p className="text-muted-foreground mt-2">
              Find research projects looking for collaborators
            </p>
          </div>
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Post Project
            </Link>
          </Button>
        </div>

        {/* Search and Filter - Client Component */}
        <ProjectsSearchClient availableSkills={allSkills} />

        {/* Results Count */}
        {searchParams.q && (
          <p className="text-sm text-muted-foreground">
            Found {projects?.length || 0} projects matching "{searchParams.q}"
          </p>
        )}

        {/* Projects Grid */}
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} showMatchScore />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">
              {searchParams.q || searchParams.skills
                ? 'No projects match your search criteria'
                : 'No projects yet. Be the first to post one!'}
            </p>
            {!searchParams.q && !searchParams.skills && (
              <Button asChild>
                <Link href="/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
