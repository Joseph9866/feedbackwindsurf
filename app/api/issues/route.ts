import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ISSUE_SEVERITIES, ISSUE_STATUSES } from '@/lib/constants';
import { createSupabaseRouteClient } from '@/lib/supabase/route-client';

const IssueInsertSchema = z.object({
  title: z.string().min(4, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  category: z.string().min(2),
  severity: z.enum(ISSUE_SEVERITIES),
  environment: z.string().max(120).optional().nullable(),
  tags: z.array(z.string().min(1)).max(8).optional().nullable(),
  expected_behavior: z.string().min(5).optional().nullable(),
  attachment_url: z.string().url().optional().nullable(),
});

export async function GET(req: Request) {
  const supabase = createSupabaseRouteClient();
  const { searchParams } = new URL(req.url);

  let query = supabase
    .from('technical_issues')
    .select('*')
    .order('created_at', { ascending: false });

  const status = searchParams.get('status');
  const severity = searchParams.get('severity');
  const category = searchParams.get('category');
  const reporterId = searchParams.get('reporter');
  const assignedTo = searchParams.get('assignee');

  if (status && ISSUE_STATUSES.includes(status as (typeof ISSUE_STATUSES)[number])) {
    query = query.eq('status', status);
  }

  if (severity && ISSUE_SEVERITIES.includes(severity as (typeof ISSUE_SEVERITIES)[number])) {
    query = query.eq('severity', severity);
  }

  if (category) query = query.ilike('category', `%${category}%`);
  if (reporterId) query = query.eq('reporter_id', reporterId);
  if (assignedTo) query = query.eq('assigned_to', assignedTo);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const payload = await req.json();

  const parsed = IssueInsertSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const { title, description, category, severity, tags, environment, expected_behavior, attachment_url } =
    parsed.data;

  const { data, error } = await supabase.from('technical_issues').insert([
    {
      title,
      description,
      category,
      severity,
      tags,
      environment,
      expected_behavior,
      attachment_url,
      reporter_id: session.user.id,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
