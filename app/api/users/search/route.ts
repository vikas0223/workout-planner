import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length === 0) {
    return Response.json({ users: [] })
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name')
      .ilike('name', `%${query}%`)
      .limit(10)

    if (error) {
      console.error('Database error:', error)
      return Response.json({ users: [] })
    }

    return Response.json({ users: data || [] })
  } catch (error) {
    console.error('Search error:', error)
    return Response.json({ users: [] })
  }
}
