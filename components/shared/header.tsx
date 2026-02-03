import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          CollabNet
        </Link>

        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/projects">Projects</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <form action="/auth/signout" method="post">
                <Button variant="outline" type="submit">
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/projects">Projects</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
