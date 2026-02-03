import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    required_skills: string[]
    max_collaborators: number
    created_at: string
    profiles: {
      full_name: string
      avatar_url: string | null
      role: string
    }
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="line-clamp-2">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.required_skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
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
