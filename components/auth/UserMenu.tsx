'use client';

import { useMemo, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2, LogIn, LogOut, Mail, User, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function UserMenu() {
  const session = useSession();
  const supabaseClient = useSupabaseClient();
  const [loading, setLoading] = useState(false);

  const userInitials = useMemo(() => {
    if (!session?.user) return 'G';
    const name = session.user.user_metadata.full_name || session.user.email;
    if (!name) return 'U';
    return name
      .split(' ')
      .map((chunk: string) => chunk[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [session]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabaseClient.auth.signOut();
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  // Always show guest mode - no authentication required
  if (!session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right', marginRight: '4px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
            Guest User
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            Browse freely
          </div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'white',
            color: '#0b1f3a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          G
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ textAlign: 'right', marginRight: '4px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
          {session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User'}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
          {session.user.email}
        </div>
      </div>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'white',
          color: '#0b1f3a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {userInitials}
      </div>
      <button 
        style={{ 
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'all 0.2s'
        }}
        onClick={handleSignOut} 
        disabled={loading}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
      >
        {loading ? <Loader2 size={16} className="spin" /> : <LogOut size={16} />}
        Sign Out
      </button>
    </div>
  );
}
