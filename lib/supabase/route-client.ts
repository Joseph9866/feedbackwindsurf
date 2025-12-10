import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database';

export const createSupabaseRouteClient = () =>
  createRouteHandlerClient<Database>({ cookies });
