'use server'

import { createClient } from '@/lib/supabase/server'
import { profileSchema, type ProfileFormData } from '@/lib/validations/profile'
import { redirect } from 'next/navigation'
import { generateEmbedding, createProfileEmbeddingText } from '@/lib/ai/embeddings'

export async function createProfile(data: ProfileFormData) {
  try {
    const validationResult = profileSchema.safeParse(data)
    
    if (!validationResult.success) {
      return { error: 'Invalid form data' }
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Not authenticated' }
    }

    // Generate embedding for the profile
    let embedding: number[] | null = null
    try {
      const embeddingText = createProfileEmbeddingText({
        bio: validationResult.data.bio,
        skills: validationResult.data.skills,
        research_interests: validationResult.data.research_interests,
        role: validationResult.data.role,
      })
      
      embedding = await generateEmbedding(embeddingText)
    } catch (error) {
      console.error('Failed to generate embedding:', error)
      // Continue without embedding - non-blocking
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
        embedding: embedding ? JSON.stringify(embedding) : null,
      })

    if (insertError) {
      console.error('Profile creation error:', insertError)
      return { error: 'Failed to create profile. Please try again.' }
    }

    redirect('/profile')
  } catch (error) {
    // If it's a redirect, re-throw it (Next.js uses errors for redirects)
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error
    }
    
    console.error('Unexpected error in createProfile:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
