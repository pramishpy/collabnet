import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/profile/create')
  }

  // Get all user applications with match scores
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      projects:project_id (
        title,
        required_skills
      )
    `)
    .eq('user_id', user.id)

  // Calculate analytics
  const totalApplications = applications?.length || 0
  const acceptedApplications = applications?.filter(app => app.status === 'accepted').length || 0
  const pendingApplications = applications?.filter(app => app.status === 'pending').length || 0
  const rejectedApplications = applications?.filter(app => app.status === 'rejected').length || 0
  
  const acceptanceRate = totalApplications > 0 
    ? Math.round((acceptedApplications / totalApplications) * 100) 
    : 0

  const acceptedPercent = totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0
  const pendingPercent = totalApplications > 0 ? (pendingApplications / totalApplications) * 100 : 0
  const rejectedPercent = totalApplications > 0 ? (rejectedApplications / totalApplications) * 100 : 0

  // Calculate average match score
  const avgMatchScore = applications && applications.length > 0
    ? applications.reduce((sum, app) => sum + (app.match_score || 0), 0) / applications.length
    : 0

  // Find most applied skills
  const skillCounts: Record<string, number> = {}
  applications?.forEach(app => {
    app.projects.required_skills.forEach((skill: string) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1
    })
  })

  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Get user's created projects stats
  const { data: myProjects } = await supabase
    .from('projects')
    .select(`
      *,
      applications:applications (
        id,
        status
      )
    `)
    .eq('creator_id', user.id)

  const totalProjectsCreated = myProjects?.length || 0
  const totalApplicationsReceived = myProjects?.reduce(
    (sum, project) => sum + (project.applications?.length || 0), 
    0
  ) || 0

  return (
    <div className="min-h-screen p-8 bg-muted/30">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <BarChart3 className="h-10 w-10" />
            Your Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Insights into your collaboration activity and match performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingApplications} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Acceptance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{acceptanceRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {acceptedApplications} accepted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Match Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {Math.round(avgMatchScore * 100)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Quality of matches
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projects Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalProjectsCreated}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalApplicationsReceived} applications received
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Application Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Application Status
            </CardTitle>
            <CardDescription>
              Breakdown of your {totalApplications} applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Accepted</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{acceptedApplications}</span>
                  <progress
                    value={acceptedPercent}
                    max={100}
                    className="w-64 h-2 overflow-hidden rounded-full bg-muted appearance-none [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-green-500 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-green-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{pendingApplications}</span>
                  <progress
                    value={pendingPercent}
                    max={100}
                    className="w-64 h-2 overflow-hidden rounded-full bg-muted appearance-none [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-yellow-500 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-yellow-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium">Rejected</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{rejectedApplications}</span>
                  <progress
                    value={rejectedPercent}
                    max={100}
                    className="w-64 h-2 overflow-hidden rounded-full bg-muted appearance-none [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-red-500 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-red-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Skills Applied For */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Most Applied Skills
              </CardTitle>
              <CardDescription>
                Skills you've applied for most frequently
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topSkills.length > 0 ? (
                <div className="space-y-3">
                  {topSkills.map(([skill, count], index) => (
                    <div key={skill} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <Badge variant="secondary">{skill}</Badge>
                      </div>
                      <span className="text-sm font-semibold">{count} projects</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No data yet. Apply to projects to see insights.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Your Profile Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Skills Profile
              </CardTitle>
              <CardDescription>
                Skills listed on your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => {
                  const skillCount = skillCounts[skill] ?? 0
                  const isInDemand = skillCount > 0
                  return (
                    <Badge 
                      key={skill} 
                      variant={isInDemand ? 'default' : 'outline'}
                      className="relative"
                    >
                      {skill}
                      {isInDemand && (
                        <span className="ml-1 text-xs">
                          ({skillCount})
                        </span>
                      )}
                    </Badge>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Numbers show how many projects you've applied to with this skill
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Match Performance Tips */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>💡 Tips to Improve Your Match Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {acceptanceRate < 30 && (
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Apply to projects with higher match scores (70%+) to increase acceptance rate</span>
                </li>
              )}
              {avgMatchScore < 0.6 && (
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Update your profile with more relevant skills to get better matches</span>
                </li>
              )}
              {totalApplications < 5 && (
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Apply to more projects to build your collaboration portfolio</span>
                </li>
              )}
              {profile.skills.length < 5 && (
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Add more skills to your profile to unlock better recommendations</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
