import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name || name.trim().length === 0) {
      return Response.json({ error: 'Name is required' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, name')
      .eq('name', name.trim())
      .single()

    if (existingUser) {
      return Response.json({ user: existingUser })
    }

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ name: name.trim() })
      .select('id, name')
      .single()

    if (error) {
      console.error('Database error:', error)
      return Response.json({ error: 'Failed to create user' }, { status: 500 })
    }

    return Response.json({ user: newUser })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
