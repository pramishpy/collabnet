import Link from 'next/link'
import { Button } from '@/components/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          CollabNet
        </h1>
        <p className="text-xl text-muted-foreground">
          Connect developers with researchers. Build projects that matter.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
        
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">For Researchers</h3>
            <p className="text-sm text-muted-foreground">
              Find skilled developers to build tools for your research
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">For Developers</h3>
            <p className="text-sm text-muted-foreground">
              Work on real projects and build your portfolio
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">AI-Powered Matching</h3>
            <p className="text-sm text-muted-foreground">
              Smart recommendations based on skills and interests
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
