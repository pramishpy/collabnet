'use server'

import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from './embeddings'

/**
 * Calculate cosine similarity between two embeddings
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Find similar profiles to a project using semantic search
 */
export async function findMatchingProfiles(
  projectId: string,
  limit: number = 10
) {
  const supabase = await createClient()

  // Get project with embedding
  const { data: project } = await supabase
    .from('projects')
    .select('embedding, required_skills')
    .eq('id', projectId)
    .single()

  if (!project?.embedding) {
    return { matches: [], error: 'Project has no embedding' }
  }

  const projectEmbedding = JSON.parse(project.embedding)

  // Get all profiles with embeddings
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role, skills, bio, embedding')
    .not('embedding', 'is', null)

  if (!profiles || profiles.length === 0) {
    return { matches: [], error: null }
  }

  // Calculate similarity scores
  const matches = profiles
    .map(profile => {
      const profileEmbedding = JSON.parse(profile.embedding)
      const similarity = cosineSimilarity(projectEmbedding, profileEmbedding)
      
      // Bonus points for skill overlap
      const skillOverlap = profile.skills.filter(skill =>
        project.required_skills.includes(skill)
      ).length
      const skillBonus = skillOverlap * 0.05 // 5% bonus per matching skill
      
      return {
        ...profile,
        match_score: Math.min(similarity + skillBonus, 1),
        matching_skills: profile.skills.filter(skill =>
          project.required_skills.includes(skill)
        ),
      }
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, limit)

  return { matches, error: null }
}

/**
 * Find similar projects for a profile using semantic search
 */
export async function findMatchingProjects(
  userId: string,
  limit: number = 10
) {
  const supabase = await createClient()

  // Get user profile with embedding
  const { data: profile } = await supabase
    .from('profiles')
    .select('embedding, skills, role')
    .eq('id', userId)
    .single()

  if (!profile?.embedding) {
    return { matches: [], error: 'Profile has no embedding' }
  }

  const profileEmbedding = JSON.parse(profile.embedding)

  // Get all active projects with embeddings
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:creator_id (
        full_name,
        avatar_url,
        role
      )
    `)
    .eq('status', 'recruiting')
    .not('embedding', 'is', null)

  if (!projects || projects.length === 0) {
    return { matches: [], error: null }
  }

  // Calculate similarity scores
  const matches = projects
    .map(project => {
      const projectEmbedding = JSON.parse(project.embedding)
      const similarity = cosineSimilarity(profileEmbedding, projectEmbedding)
      
      // Bonus for skill match
      const skillOverlap = profile.skills.filter(skill =>
        project.required_skills.includes(skill)
      ).length
      const skillBonus = skillOverlap * 0.05
      
      return {
        ...project,
        match_score: Math.min(similarity + skillBonus, 1),
        matching_skills: profile.skills.filter(skill =>
          project.required_skills.includes(skill)
        ),
      }
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, limit)

  return { matches, error: null }
}

/**
 * Get personalized recommendations for the current user
 */
export async function getRecommendedProjects(limit: number = 6) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { projects: [], error: 'Not authenticated' }
  }

  const result = await findMatchingProjects(user.id, limit)
  
  return { projects: result.matches, error: result.error }
}
