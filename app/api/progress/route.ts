import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')

  if (!userId) {
    return Response.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return Response.json({ progress: [] })
    }

    return Response.json({ progress: data || [] })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return Response.json({ progress: [] })
  }
}
