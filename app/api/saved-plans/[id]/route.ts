import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('saved_plans')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Database error:', error)
      return Response.json({ error: 'Failed to delete plan' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting plan:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
