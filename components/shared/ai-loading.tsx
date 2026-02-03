import { Loader2, Sparkles } from 'lucide-react'

export function AILoading({ message = 'Analyzing with AI...' }: { message?: string }) {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <div className="relative">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <Loader2 className="h-3 w-3 absolute top-1 left-1 animate-spin" />
      </div>
      <span className="text-sm">{message}</span>
    </div>
  )
}
