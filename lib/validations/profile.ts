import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  role: z.enum(['developer', 'researcher', 'hobbyist'], {
    required_error: 'Please select a role',
  }),
  bio: z.string().min(20, 'Bio must be at least 20 characters').max(500),
  skills: z.array(z.string()).min(1, 'Add at least one skill').max(20),
  research_interests: z.string().min(10, 'Describe your interests (at least 10 characters)').max(500),
  github_username: z.string().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>
