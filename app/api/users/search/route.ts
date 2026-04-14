import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length === 0) {
    return Response.json({ users: [] })
  }

  try {
    // Try with timeout to prevent hanging
    const { data, error } = await Promise.race([
      supabase
        .from('users')
        .select('id, name')
        .ilike('name', `%${query}%`)
        .limit(10),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      ),
    ]) as any

    if (error) {
      console.warn('[UserSearch] Database unavailable:', error)
      return Response.json({ users: [] })
    }

    return Response.json({ users: data || [] })
  } catch (error) {
    console.warn('[UserSearch] Error (returning empty, fallback mode):', error)
    // Return empty array in fallback mode - suggestions won't show but form still works
    return Response.json({ users: [] })
  }
}
