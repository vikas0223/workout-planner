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
      .from('saved_plans')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return Response.json({ plans: [] })
    }

    return Response.json({ plans: data || [] })
  } catch (error) {
    console.error('Error fetching saved plans:', error)
    return Response.json({ plans: [] })
  }
}
