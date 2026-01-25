import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-muted-foreground">
            Logged in as: <span className="font-semibold text-foreground">{user.email}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Profile creation coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
