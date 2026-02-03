import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, Sparkles } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    required_skills: string[]
    max_collaborators: number
    created_at: string
    match_score?: number
    matching_skills?: string[]
    profiles: {
      full_name: string
      avatar_url: string | null
      role: string
    }
  }
  showMatchScore?: boolean
}

export function ProjectCard({ project, showMatchScore = false }: ProjectCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const hasHighMatch = project.match_score && project.match_score >= 0.7

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className={`h-full hover:shadow-lg transition-shadow cursor-pointer ${
        hasHighMatch ? 'border-primary/30' : ''
      }`}>
        <CardHeader className="relative">
          {showMatchScore && project.match_score && (
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {Math.round(project.match_score * 100)}%
            </div>
          )}
          <CardTitle className="line-clamp-2 pr-16">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.required_skills.slice(0, 4).map((skill) => {
              const isMatching = project.matching_skills?.includes(skill)
              return (
                <Badge
                  key={skill}
                  variant={isMatching ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {skill}
                </Badge>
              )
            })}
            {project.required_skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.required_skills.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={project.profiles.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(project.profiles.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{project.profiles.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {project.profiles.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {project.max_collaborators}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
