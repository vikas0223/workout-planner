'use client'

import UserEntry from "@/components/user-entry"

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-indigo-200 via-purple-200 to-indigo-300 text-slate-800 py-12 px-4 min-h-screen flex items-center justify-center">
      <div className="container max-w-2xl mx-auto">
        <UserEntry />
      </div>
    </main>
  )
}
