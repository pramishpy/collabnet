'use server'

import { createClient } from '@/lib/supabase/server'

export async function getProjectsWithMatchScores(filters: {
  q?: string
  skills?: string
  status?: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Build base query
  let query = supabase
    .from('projects')
    .select(`
      *,
      profiles:creator_id (
        full_name,
        avatar_url,
        role
      )
    `)

  // Apply filters
  const statusFilter = filters.status?.split(',').filter(Boolean) || ['recruiting']
  if (statusFilter.length > 0) {
    query = query.in('status', statusFilter)
  }

  if (filters.skills) {
    const skills = filters.skills.split(',').filter(Boolean)
    if (skills.length > 0) {
      query = query.overlaps('required_skills', skills)
    }
  }

  if (filters.q) {
    const searchTerm = `%${filters.q}%`
    query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
  }

  const { data: projects } = await query

  if (!projects || !user) {
    return projects || []
  }

  // Get user profile for matching
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('embedding, skills')
    .eq('id', user.id)
    .single()

  if (!userProfile?.embedding) {
    return projects
  }

  const userEmbedding = JSON.parse(userProfile.embedding)

  // Calculate match scores
  const projectsWithScores = projects.map(project => {
    if (!project.embedding) {
      return { ...project, match_score: 0, matching_skills: [] }
    }

    const projectEmbedding = JSON.parse(project.embedding)

    // Cosine similarity
    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < userEmbedding.length; i++) {
      dotProduct += userEmbedding[i] * projectEmbedding[i]
      normA += userEmbedding[i] * userEmbedding[i]
      normB += projectEmbedding[i] * projectEmbedding[i]
    }

    let matchScore = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))

    // Skill matching
    const matchingSkills = userProfile.skills.filter(skill =>
      project.required_skills.includes(skill)
    )

    const skillBonus = matchingSkills.length * 0.05
    matchScore = Math.min(matchScore + skillBonus, 1)

    return {
      ...project,
      match_score: matchScore,
      matching_skills: matchingSkills,
    }
  })

  // Sort by match score (descending)
  return projectsWithScores.sort((a, b) => b.match_score - a.match_score)
}
