'use server'

import { createClient } from '@/lib/supabase/server'
import { profileSchema, type ProfileFormData } from '@/lib/validations/profile'
import { redirect } from 'next/navigation'

export async function createProfile(data: ProfileFormData) {
  // Validate data server-side
  const validationResult = profileSchema.safeParse(data)
  
  if (!validationResult.success) {
    return { error: 'Invalid form data' }
  }

  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Insert profile
  const { error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email!,
      full_name: validationResult.data.full_name,
      role: validationResult.data.role,
      bio: validationResult.data.bio,
      skills: validationResult.data.skills,
      research_interests: validationResult.data.research_interests,
      github_username: validationResult.data.github_username || null,
    })

  if (insertError) {
    console.error('Profile creation error:', insertError)
    return { error: 'Failed to create profile. Please try again.' }
  }

  redirect('/profile')
}
