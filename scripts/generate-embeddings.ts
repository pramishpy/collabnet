import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.substring(0, 8000),
  })

  const embedding = response.data?.[0]?.embedding
  if (!embedding) {
    throw new Error('OpenAI embeddings response did not include an embedding.')
  }

  return embedding
}

async function backfillProfileEmbeddings() {
  console.log('🔄 Fetching profiles without embeddings...')
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .is('embedding', null)

  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }

  console.log(`📊 Found ${profiles.length} profiles to process`)

  let processed = 0
  let failed = 0

  for (const profile of profiles) {
    try {
      const text = `
        Role: ${profile.role}
        Bio: ${profile.bio}
        Skills: ${profile.skills.join(', ')}
        Research Interests: ${profile.research_interests}
      `.trim()

      console.log(`Processing profile: ${profile.full_name}`)
      const embedding = await generateEmbedding(text)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ embedding: JSON.stringify(embedding) })
        .eq('id', profile.id)

      if (updateError) {
        console.error(`❌ Failed to update profile ${profile.full_name}:`, updateError)
        failed++
      } else {
        console.log(`✅ Updated profile: ${profile.full_name}`)
        processed++
      }

      // Rate limit: wait 100ms between requests (10 req/sec)
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`❌ Error processing profile ${profile.full_name}:`, error)
      failed++
    }
  }

  console.log(`\n✨ Profile embeddings complete: ${processed} processed, ${failed} failed`)
}

async function backfillProjectEmbeddings() {
  console.log('\n🔄 Fetching projects without embeddings...')
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .is('embedding', null)

  if (error) {
    console.error('Error fetching projects:', error)
    return
  }

  console.log(`📊 Found ${projects.length} projects to process`)

  let processed = 0
  let failed = 0

  for (const project of projects) {
    try {
      const text = `
        Title: ${project.title}
        Description: ${project.description}
        Required Skills: ${project.required_skills.join(', ')}
      `.trim()

      console.log(`Processing project: ${project.title}`)
      const embedding = await generateEmbedding(text)

      const { error: updateError } = await supabase
        .from('projects')
        .update({ embedding: JSON.stringify(embedding) })
        .eq('id', project.id)

      if (updateError) {
        console.error(`❌ Failed to update project ${project.title}:`, updateError)
        failed++
      } else {
        console.log(`✅ Updated project: ${project.title}`)
        processed++
      }

      // Rate limit: wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`❌ Error processing project ${project.title}:`, error)
      failed++
    }
  }

  console.log(`\n✨ Project embeddings complete: ${processed} processed, ${failed} failed`)
}

async function main() {
  console.log('🚀 Starting embedding generation...\n')
  
  await backfillProfileEmbeddings()
  await backfillProjectEmbeddings()
  
  console.log('\n🎉 All embeddings generated!')
  process.exit(0)
}

main().catch(console.error)
