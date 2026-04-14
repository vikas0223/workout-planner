import type { Metadata } from 'next'
import { UserProvider } from '@/lib/user-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Workout Planner',
  description: 'Create and track your personalized workout plans',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
