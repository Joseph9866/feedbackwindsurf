import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

let adminClient: SupabaseClient<Database> | null = null;

export const getSupabaseAdminClient = () => {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase admin credentials are not configured');
  }

  adminClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'windsurf-issue-platform-server',
      },
    },
  });

  return adminClient;
};
