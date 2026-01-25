import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/components/ui/card'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We've sent you a confirmation link. Click it to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Don't see the email? Check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
