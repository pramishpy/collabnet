import { Header } from '@/components/shared/header'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata = {
  title: 'CollabNet - Research Collaboration Platform',
  description: 'Connect developers with researchers for cross-disciplinary collaboration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
