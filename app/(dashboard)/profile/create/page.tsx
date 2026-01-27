'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TagInput } from '@/components/profile/tag-input'
import { GitHubVerify } from '@/components/profile/github-verify'
import { profileSchema, type ProfileFormData } from '@/lib/validations/profile'
import { createProfile } from './actions'
import { Loader2 } from 'lucide-react'

export default function CreateProfilePage() {
  const router = useRouter()
  const [skills, setSkills] = useState<string[]>([])
  const [githubUsername, setGithubUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: 'developer',
      skills: [],
      github_username: '',
    },
  })

  // Update form when tags change
  const handleSkillsChange = (newSkills: string[]) => {
    setSkills(newSkills)
    setValue('skills', newSkills, { shouldValidate: true })
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      const result = await createProfile(data)
      
      if (result.error) {
        alert(result.error)
      } else {
        router.push('/profile')
      }
    } catch (error) {
      alert('Failed to create profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Profile</CardTitle>
            <CardDescription>
              Tell us about yourself to start connecting with collaborators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  placeholder="John Doe"
                />
                {errors.full_name && (
                  <p className="text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>I am a...</Label>
                <RadioGroup
                  defaultValue="developer"
                  onValueChange={(value) => setValue('role', value as 'developer' | 'researcher' | 'hobbyist')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="developer" id="developer" />
                    <Label htmlFor="developer" className="font-normal cursor-pointer">
                      Developer - I build software and tools
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="researcher" id="researcher" />
                    <Label htmlFor="researcher" className="font-normal cursor-pointer">
                      Researcher - I need technical help with my research
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hobbyist" id="hobbyist" />
                    <Label htmlFor="hobbyist" className="font-normal cursor-pointer">
                      Hobbyist - I explore projects for learning
                    </Label>
                  </div>
                </RadioGroup>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Tell us about your background, interests, and what you're looking for..."
                  rows={4}
                />
                {errors.bio && (
                  <p className="text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label>Skills</Label>
                <TagInput
                  tags={skills}
                  setTags={handleSkillsChange}
                  placeholder="e.g., python, react, machine-learning"
                />
                {errors.skills && (
                  <p className="text-sm text-red-600">{errors.skills.message}</p>
                )}
              </div>

              {/* Research Interests */}
              <div className="space-y-2">
                <Label htmlFor="research_interests">Research Interests / Project Goals</Label>
                <Textarea
                  id="research_interests"
                  {...register('research_interests')}
                  placeholder="What topics, domains, or types of projects interest you?"
                  rows={3}
                />
                {errors.research_interests && (
                  <p className="text-sm text-red-600">{errors.research_interests.message}</p>
                )}
              </div>

              {/* GitHub Username */}
              <div className="space-y-2">
                <Label htmlFor="github_username">GitHub Username (Optional)</Label>
                <GitHubVerify
                  value={githubUsername}
                  onChange={(value) => {
                    setGithubUsername(value)
                    setValue('github_username', value)
                  }}
                />
                {errors.github_username && (
                  <p className="text-sm text-red-600">{errors.github_username.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Create Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
