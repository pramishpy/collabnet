'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function applyToProject(projectId: string, message: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Check if user has a profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Please create your profile first' }
  }

  // Check if already applied
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return { error: 'You have already applied to this project' }
  }

  // Create application
  const { error: insertError } = await supabase
    .from('applications')
    .insert({
      project_id: projectId,
      user_id: user.id,
      message: message,
      status: 'pending',
    })

  if (insertError) {
    console.error('Application error:', insertError)
    return { error: 'Failed to submit application' }
  }

  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'accepted' | 'rejected'
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify user is the project creator
  const { data: application } = await supabase
    .from('applications')
    .select(`
      *,
      projects:project_id (creator_id)
    `)
    .eq('id', applicationId)
    .single()

  if (!application || application.projects.creator_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  // Update status
  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)

  if (error) {
    return { error: 'Failed to update application' }
  }

  revalidatePath(`/projects/${application.project_id}`)
  return { success: true }
}
