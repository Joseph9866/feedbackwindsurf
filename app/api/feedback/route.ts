import { NextResponse } from 'next/server';
import { z } from 'zod';
import { FEEDBACK_CHANNELS, FEEDBACK_SENTIMENTS } from '@/lib/constants';
import { createSupabaseRouteClient } from '@/lib/supabase/route-client';
import { getSupabaseAdminClient } from '@/lib/supabase/admin-client';
import { FeedbackInsertSchema } from '@/lib/validation';
import { Database } from '@/types/database';

const FeedbackFilterSchema = z.object({
  sentiment: z.enum(FEEDBACK_SENTIMENTS).optional(),
  channel: z.enum(FEEDBACK_CHANNELS).optional(),
});

export async function GET(req: Request) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const filters = FeedbackFilterSchema.safeParse({
    sentiment: searchParams.get('sentiment') ?? undefined,
    channel: searchParams.get('channel') ?? undefined,
  });

  let query = supabase.from('feedback_entries').select('*').order('created_at', { ascending: false });

  if (filters.success) {
    if (filters.data.sentiment) query = query.eq('sentiment', filters.data.sentiment);
    if (filters.data.channel) query = query.eq('channel', filters.data.channel);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const parsed = FeedbackInsertSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const supabase = createSupabaseRouteClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const insertPayload: Database['public']['Tables']['feedback_entries']['Insert'] = {
    sentiment: parsed.data.sentiment,
    category: parsed.data.category,
    message: parsed.data.message,
    channel: parsed.data.channel,
    is_anonymous: parsed.data.is_anonymous,
    submitted_by: session?.user.id ?? null,
    metadata: null,
  };

  // Require auth if user wants to share non-anonymously
  if (!session && !parsed.data.is_anonymous) {
    return NextResponse.json({ error: 'Sign in to attach your name' }, { status: 401 });
  }

  if (session) {
    const { data, error } = await supabase.from('feedback_entries').insert([insertPayload]).select('*');
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data }, { status: 201 });
  }

  const adminClient = getSupabaseAdminClient();
  const { data, error } = await adminClient.from('feedback_entries').insert([insertPayload]).select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
