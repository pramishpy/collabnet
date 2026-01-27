import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle>Authentication Error</CardTitle>
          </div>
          <CardDescription>
            The confirmation link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Email confirmation links expire after a certain time for security reasons.
            Please sign up again to receive a new confirmation email.
          </p>
          
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/signup">Sign Up Again</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
