'use client'

import { Button } from '@/components/components/ui/button'
import { Input } from '@/components/components/ui/input'
import { Label } from '@/components/components/ui/label'
import { signup } from './actions'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating account...' : 'Sign Up'}
    </Button>
  )
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signup, { error: '' })

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
          {state.error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">USM Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@usm.edu"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          minLength={6}
          required
        />
      </div>

      <SubmitButton />
    </form>
  )
}
