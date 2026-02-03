'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Check } from 'lucide-react'
import { applyToProject } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

interface ApplyButtonProps {
  projectId: string
  hasApplied: boolean
  applicationStatus?: string
}

const isApplicationStatus = (value?: string): value is ApplicationStatus =>
  value === 'pending' || value === 'accepted' || value === 'rejected'

export function ApplyButton({ projectId, hasApplied, applicationStatus }: ApplyButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await applyToProject(projectId, message)
      
      if (result.error) {
        toast.error('Application Failed', {
          description: result.error,
        })
      } else {
        toast.success('Application Submitted!', {
          description: 'The project creator will review your application.',
        })
        setOpen(false)
        setMessage('')
        router.refresh()
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasApplied) {
    const statusColors: Record<ApplicationStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    }

    const status: ApplicationStatus = isApplicationStatus(applicationStatus) ? applicationStatus : 'pending'
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1)

    return (
      <Button
        variant="outline"
        className={statusColors[status]}
        disabled
      >
        <Check className="mr-2 h-4 w-4" />
        Applied · {statusLabel}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Apply to Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to this Project</DialogTitle>
          <DialogDescription>
            Introduce yourself and explain why you'd be a great fit for this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'm interested in this project because..."
              rows={6}
              required
              minLength={20}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 20 characters
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
