'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, Loader2 } from 'lucide-react'
import { updateApplicationStatus } from './actions'

interface ApplicationActionsProps {
  applicationId: string
}

export function ApplicationActions({ applicationId }: ApplicationActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (status: 'accepted' | 'rejected') => {
    setIsLoading(true)
    
    try {
      const result = await updateApplicationStatus(applicationId, status)
      
      if (result.error) {
        alert(result.error)
      } else {
        window.location.reload()
      }
    } catch (error) {
      alert('Failed to update application')
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
