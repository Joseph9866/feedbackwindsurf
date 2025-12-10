'use client';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Session } from '@supabase/supabase-js';
import { createContext, useContext, useMemo } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/database';

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'] | null;

type Props = {
  children: React.ReactNode;
  session: Session | null;
  profile: UserProfile;
};

const ProfileContext = createContext<UserProfile>(null);

export default function SupabaseProvider({ children, session, profile }: Props) {
  const supabaseClient = useMemo(() => createSupabaseBrowserClient(), []);

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={session}>
      <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>
    </SessionContextProvider>
  );
}

export const useUserProfile = () => useContext(ProfileContext);
