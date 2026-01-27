'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

interface GitHubVerifyProps {
  value: string
  onChange: (value: string) => void
}

export function GitHubVerify({ value, onChange }: GitHubVerifyProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')

  const checkUsername = async () => {
    if (!value.trim()) {
      setStatus('idle')
      return
    }

    setStatus('checking')

    try {
      const response = await fetch(`https://api.github.com/users/${value}`)
      
      if (response.ok) {
        setStatus('valid')
      } else if (response.status === 404) {
        setStatus('invalid')
      } else {
        setStatus('idle')
      }
    } catch (error) {
      setStatus('idle')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              setStatus('idle')
            }}
            placeholder="octocat"
            className="pr-10"
          />
          {status === 'checking' && (
            <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {status === 'valid' && (
            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-600" />
          )}
          {status === 'invalid' && (
            <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-600" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={checkUsername}
          disabled={!value.trim() || status === 'checking'}
        >
          Verify
        </Button>
      </div>
      {status === 'invalid' && (
        <p className="text-xs text-red-600">Username not found on GitHub</p>
      )}
      {status === 'valid' && (
        <p className="text-xs text-green-600">GitHub account verified ✓</p>
      )}
    </div>
  )
}
