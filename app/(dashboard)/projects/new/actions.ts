'use server'

import { createClient } from '@/lib/supabase/server'
import { projectSchema, type ProjectFormData } from '@/lib/validations/project'
import { revalidatePath } from 'next/cache'

export async function createProject(data: ProjectFormData) {
  const validationResult = projectSchema.safeParse(data)
  
  if (!validationResult.success) {
    return { error: 'Invalid form data' }
  }

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

  // Insert project
  const { data: project, error: insertError } = await supabase
    .from('projects')
    .insert({
      creator_id: user.id,
      title: validationResult.data.title,
      description: validationResult.data.description,
      required_skills: validationResult.data.required_skills,
      max_collaborators: validationResult.data.max_collaborators,
      status: validationResult.data.status,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Project creation error:', insertError)
    return { error: 'Failed to create project. Please try again.' }
  }

  revalidatePath('/projects')
  return { projectId: project.id }
}
