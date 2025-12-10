import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database';
import type { ReactNode } from 'react';

declare module '@supabase/auth-helpers-react' {
  type SessionContextValue = {
    session: Session | null;
    supabaseClient: SupabaseClient<Database>;
  };

  interface SessionContextProviderProps {
    supabaseClient: SupabaseClient<Database>;
    initialSession: Session | null;
    children: ReactNode;
  }

  export function SessionContextProvider(props: SessionContextProviderProps): JSX.Element;
  export function useSession(): Session | null;
  export function useSupabaseClient(): SupabaseClient<Database>;
  export function useSessionContext(): SessionContextValue;
}
