import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  required_skills: z.array(z.string())
    .min(1, 'Add at least one required skill')
    .max(15, 'Maximum 15 skills allowed'),
  max_collaborators: z.number()
    .min(1, 'Need at least 1 collaborator')
    .max(10, 'Maximum 10 collaborators'),
  status: z.enum(['recruiting', 'ongoing', 'completed'])
    .default('recruiting'),
})

export type ProjectFormData = z.infer<typeof projectSchema>
