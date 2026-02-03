'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TagInput } from '@/components/profile/tag-input'
import { projectSchema, type ProjectFormData } from '@/lib/validations/project'
import { createProject } from './actions'
import { Loader2, Plus } from 'lucide-react'

export default function NewProjectPage() {
  const router = useRouter()
  const [requiredSkills, setRequiredSkills] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [descriptionLength, setDescriptionLength] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      required_skills: [],
      max_collaborators: 3,
      status: 'recruiting',
    },
  })

  const handleSkillsChange = (newSkills: string[]) => {
    setRequiredSkills(newSkills)
    setValue('required_skills', newSkills, { shouldValidate: true })
  }

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    try {
      const result = await createProject(data)
      
      if (result.error) {
        alert(result.error)
      } else if (result.projectId) {
        router.push(`/projects/${result.projectId}`)
      }
    } catch (error) {
      alert('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-6 w-6" />
              Create a Project
            </CardTitle>
            <CardDescription>
              Post a project to find collaborators who can help bring your research to life
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Project Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Project Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Build a data visualization tool for climate research"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {descriptionLength}/2000
                  </span>
                </div>
                <Textarea
                  id="description"
                  {...register('description')}
                  onChange={(e) => {
                    setDescriptionLength(e.target.value.length)
                    register('description').onChange(e)
                  }}
                  placeholder="Describe your project: What problem does it solve? What will collaborators help build? What's the expected timeline?"
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about what you need help with and what experience level you're looking for
                </p>
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Required Skills */}
              <div className="space-y-2">
                <Label>
                  Required Skills <span className="text-red-500">*</span>
                </Label>
                <TagInput
                  tags={requiredSkills}
                  setTags={handleSkillsChange}
                  placeholder="e.g., python, data-visualization, d3.js"
                  maxTags={15}
                />
                <p className="text-xs text-muted-foreground">
                  List the technical skills needed for this project
                </p>
                {errors.required_skills && (
                  <p className="text-sm text-red-600">{errors.required_skills.message}</p>
                )}
              </div>

              {/* Max Collaborators */}
              <div className="space-y-2">
                <Label htmlFor="max_collaborators">
                  Number of Collaborators Needed
                </Label>
                <Input
                  id="max_collaborators"
                  type="number"
                  min={1}
                  max={10}
                  {...register('max_collaborators', { valueAsNumber: true })}
                />
                {errors.max_collaborators && (
                  <p className="text-sm text-red-600">{errors.max_collaborators.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
