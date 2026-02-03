import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ApplicationActions } from './application-actions'
import { Mail, Calendar } from 'lucide-react'

interface ApplicationsListProps {
  projectId: string
  applicationsCount: number
}

export async function ApplicationsList({ projectId, applicationsCount }: ApplicationsListProps) {
  const supabase = await createClient()

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        role,
        email,
        skills,
        bio
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

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
    <Card>
      <CardHeader>
        <CardTitle>
          Applications ({applicationsCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="border rounded-lg p-4 space-y-3"
              >
                {/* Applicant Header */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={application.profiles.avatar_url || undefined} />
                      <AvatarFallback>
                        {getInitials(application.profiles.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{application.profiles.full_name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {application.profiles.role}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {application.profiles.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Applied {formatDate(application.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={
                      application.status === 'pending'
                        ? 'secondary'
                        : application.status === 'accepted'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>

                {/* Applicant Skills */}
                <div className="flex flex-wrap gap-2">
                  {application.profiles.skills.slice(0, 6).map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {application.profiles.skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{application.profiles.skills.length - 6}
                    </Badge>
                  )}
                </div>

                {/* Application Message */}
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">{application.message}</p>
                </div>

                {/* Actions */}
                {application.status === 'pending' && (
                  <ApplicationActions applicationId={application.id} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No applications yet
          </p>
        )}
      </CardContent>
    </Card>
  )
}
