import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ApplyButton } from '@/components/projects/apply-button'
import { ApplicationsList } from '@/components/projects/applications-list'
import type { Metadata } from 'next'
import { MatchExplanation } from '@/components/projects/match-explanation'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const supabase = await createClient()
  
  const { data: project } = await supabase
    .from('projects')
    .select('title, description')
    .eq('id', params.id)
    .single()

  if (!project) {
    return {
      title: 'Project Not Found | CollabNet',
    }
  }

  return {
    title: `${project.title} | CollabNet`,
    description: project.description.slice(0, 160),
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch project with creator info
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:creator_id (
        id,
        full_name,
        avatar_url,
        role,
        email
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !project) {
    notFound()
  }

  // Check if current user has applied
  const { data: existingApplication } = await supabase
    .from('applications')
    .select('*')
    .eq('project_id', project.id)
    .eq('user_id', user.id)
    .single()

  // Get application count
  const { count: applicationsCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', project.id)

  // Calculate match score if user has a profile
  let matchScore = 0
  let matchingSkills: string[] = []
  let userProfile: { role?: string; skills?: string[]; embedding?: string } | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('embedding, skills, role')
      .eq('id', user.id)
      .single()

    userProfile = profile

    if (profile?.embedding && project.embedding) {
      const userEmbedding = JSON.parse(profile.embedding)
      const projectEmbedding = JSON.parse(project.embedding)

      // Calculate cosine similarity
      let dotProduct = 0
      let normA = 0
      let normB = 0

      for (let i = 0; i < userEmbedding.length; i++) {
        dotProduct += userEmbedding[i] * projectEmbedding[i]
        normA += userEmbedding[i] * userEmbedding[i]
        normB += projectEmbedding[i] * projectEmbedding[i]
      }

      matchScore = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))

      // Find matching skills
      matchingSkills = profile.skills.filter((skill: string) =>
        project.required_skills.includes(skill)
      )

      // Add skill bonus
      const skillBonus = matchingSkills.length * 0.05
      matchScore = Math.min(matchScore + skillBonus, 1)
    }
  }

  const isCreator = user.id === project.creator_id
  const hasApplied = !!existingApplication

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen p-8 bg-muted/30">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {/* Project Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      project.status === 'recruiting'
                        ? 'default'
                        : project.status === 'ongoing'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Posted {formatDate(project.created_at)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

                {/* Creator Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={project.profiles.avatar_url || undefined} />
                    <AvatarFallback>
                      {getInitials(project.profiles.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.profiles.full_name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {project.profiles.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Apply Button or Creator Actions */}
              {!isCreator && project.status === 'recruiting' && (
                <ApplyButton
                  projectId={project.id}
                  hasApplied={hasApplied}
                  applicationStatus={existingApplication?.status}
                />
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            {/* Applications (Only visible to creator) */}
            {isCreator && (
              <ApplicationsList
                projectId={project.id}
                applicationsCount={applicationsCount || 0}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Required Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.required_skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Collaborators Needed
                  </span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">{project.max_collaborators}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Applications</span>
                  <span className="font-semibold">{applicationsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className="capitalize">
                    {project.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Match Explanation */}
            {!isCreator && matchScore > 0 && (
              <MatchExplanation
                matchScore={matchScore}
                matchingSkills={matchingSkills}
                requiredSkills={project.required_skills}
                userRole={userProfile?.role || 'developer'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
