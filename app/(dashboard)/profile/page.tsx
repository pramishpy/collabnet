import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Redirect to create if no profile
  if (!profile) {
    redirect('/profile/create')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{profile.full_name}</h2>
            <p className="text-muted-foreground capitalize">{profile.role}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Bio</h3>
            <p className="text-sm">{profile.bio}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string) => (
                <span key={skill} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Research Interests</h3>
            <p className="text-sm">{profile.research_interests}</p>
          </div>

          {profile.github_username && (
            <div>
              <h3 className="font-semibold mb-2">GitHub</h3>
              <a
                href={`https://github.com/${profile.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                @{profile.github_username}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
