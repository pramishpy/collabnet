'use server'

import { createClient } from '@/lib/supabase/server'
import { projectSchema, type ProjectFormData } from '@/lib/validations/project'
import { revalidatePath } from 'next/cache'
import { generateEmbedding, createProjectEmbeddingText } from '@/lib/ai/embeddings'

export async function createProject(data: ProjectFormData) {
  const validationResult = projectSchema.safeParse(data)
  
  if (!validationResult.success) {
    return { error: 'Invalid form data' }
  }

  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Please create your profile first' }
  }

  // Generate embedding for the project
  let embedding: number[] | null = null
  try {
    const embeddingText = createProjectEmbeddingText({
      title: validationResult.data.title,
      description: validationResult.data.description,
      required_skills: validationResult.data.required_skills,
    })
    
    embedding = await generateEmbedding(embeddingText)
  } catch (error) {
    console.error('Failed to generate project embedding:', error)
    // Continue without embedding - non-blocking
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
      embedding: embedding ? JSON.stringify(embedding) : null,
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
