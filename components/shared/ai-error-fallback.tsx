import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function AIErrorFallback() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>AI Feature Unavailable</AlertTitle>
      <AlertDescription>
        We're having trouble with smart recommendations right now. 
        You can still browse all projects manually.
      </AlertDescription>
    </Alert>
  )
}
