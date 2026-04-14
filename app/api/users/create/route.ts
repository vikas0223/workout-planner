import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

function generateId(): string {
  return randomUUID()
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name || name.trim().length === 0) {
      return Response.json({ error: 'Name is required' }, { status: 400 })
    }

    const trimmedName = name.trim()
    const userId = generateId()

    // Try to use database if available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        // Check if user already exists
        const { data: existingUser, error: checkError } = await Promise.race([
          supabase
            .from('users')
            .select('id, name')
            .eq('name', trimmedName)
            .single(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database timeout')), 5000)
          ),
        ]) as any

        if (!checkError && existingUser) {
          return Response.json({ user: existingUser })
        }

        // Create new user
        const { data: newUser, error: insertError } = await Promise.race([
          supabase
            .from('users')
            .insert({ id: userId, name: trimmedName })
            .select('id, name')
            .single(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database timeout')), 5000)
          ),
        ]) as any

        if (!insertError && newUser) {
          return Response.json({ user: newUser })
        }
      } catch (dbError) {
        console.warn('[UserCreate] Database unavailable, using fallback:', dbError)
      }
    }

    // Fallback: Create user locally for offline/fallback mode
    const fallbackUser = { id: userId, name: trimmedName }
    console.log('[UserCreate] Using fallback user creation:', fallbackUser)
    return Response.json({ user: fallbackUser })
  } catch (error) {
    console.error('[UserCreate] Error:', error)
    // Return a default user object for graceful degradation
    const fallbackId = generateId()
    return Response.json({ user: { id: fallbackId, name: 'Guest' } })
  }
}
