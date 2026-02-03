'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, Loader2 } from 'lucide-react'
import { updateApplicationStatus } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ApplicationActionsProps {
  applicationId: string
  applicantName: string
}

export function ApplicationActions({ applicationId, applicantName }: ApplicationActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (status: 'accepted' | 'rejected') => {
    setIsLoading(true)
    
    try {
      const result = await updateApplicationStatus(applicationId, status)
      
      if (result.error) {
        toast.error('Update Failed', {
          description: result.error,
        })
      } else {
        toast.success(
          status === 'accepted' ? 'Application Accepted' : 'Application Declined',
          {
            description: `You ${status} ${applicantName}'s application.`,
          }
        )
        router.refresh()
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handleAction('accepted')}
        disabled={isLoading}
        className="flex-1"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Accept
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleAction('rejected')}
        disabled={isLoading}
        className="flex-1"
      >
        <X className="mr-2 h-4 w-4" />
        Decline
      </Button>
    </div>
  )
}
