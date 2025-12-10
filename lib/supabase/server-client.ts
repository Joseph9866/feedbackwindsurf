import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database';

export const createServerSupabaseClient = () =>
  createServerComponentClient<Database>({ cookies });
