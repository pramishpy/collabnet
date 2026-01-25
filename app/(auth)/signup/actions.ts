'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Define the state type
type FormState = {
  error: string
}

export async function signup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Validate USM email
  if (!email.endsWith('@usm.edu')) {
    return { error: 'Please use your @usm.edu email address' }
  }

  // Check password match
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/auth/verify-email')
}
