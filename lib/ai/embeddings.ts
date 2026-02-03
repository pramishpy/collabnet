import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // 1536 dimensions, cost-effective
      input: text.substring(0, 8000), // Token limit
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

/**
 * Create a combined text representation of a profile for embedding
 */
export function createProfileEmbeddingText(profile: {
  bio: string
  skills: string[]
  research_interests: string
  role: string
}): string {
  return `
    Role: ${profile.role}
    Bio: ${profile.bio}
    Skills: ${profile.skills.join(', ')}
    Research Interests: ${profile.research_interests}
  `.trim()
}

/**
 * Create a combined text representation of a project for embedding
 */
export function createProjectEmbeddingText(project: {
  title: string
  description: string
  required_skills: string[]
}): string {
  return `
    Title: ${project.title}
    Description: ${project.description}
    Required Skills: ${project.required_skills.join(', ')}
  `.trim()
}

/**
 * Generate embeddings in batch (up to 100 texts)
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts.map(text => text.substring(0, 8000)),
    })

    return response.data.map(item => item.embedding)
  } catch (error) {
    console.error('Error generating embeddings batch:', error)
    throw new Error('Failed to generate embeddings')
  }
}
