import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import SupabaseProvider from '@/components/providers/SupabaseProvider';
import UserMenu from '@/components/auth/UserMenu';
import NavLink from '@/components/navigation/NavLink';
import { Database } from '@/types/database';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Windsurf Issues & Feedback Hub',
  description:
    'High-velocity triage portal for Windsurf engineering teams to capture bugs and anonymous insights.',
};

const navLinks = [
  { href: '/', label: 'Home', icon: 'dashboard' },
  { href: '/submit-issue', label: 'Report Issue', icon: 'alert' },
  { href: '/feedback', label: 'Anonymous Feedback', icon: 'message' },
] as const;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let profile = null;
  if (session?.user) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    profile = data ?? null;
  }

  const isAdmin = true; // TEMPORARY: Always show admin button for testing
  // const isAdmin = profile?.role === 'admin'; // Uncomment this in production

  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider session={session} profile={profile}>
          <header
            style={{
              background: 'linear-gradient(135deg, #0b1f3a, #1a73e8)',
              padding: '24px 0',
              color: 'white',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
            }}
          >
            <div className="container" style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: 4 }}>
                  Windsurf Reliability
                </p>
                <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Issue & Feedback Control Center</h1>
              </div>
              <UserMenu />
            </div>
            <nav className="container" style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
              {navLinks.map((link) => (
                <NavLink 
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                />
              ))}
              {isAdmin && (
                <NavLink
                  href="/admin"
                  label="Admin Review Panel"
                  icon="shield"
                  isAdmin={true}
                />
              )}
            </nav>
          </header>
          <main className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
            {children}
          </main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
