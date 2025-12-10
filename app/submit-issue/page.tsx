import IssueForm from '@/components/forms/IssueForm';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { Database } from '@/types/database';

export const metadata = {
  title: 'Report Technical Issue • Windsurf Hub',
};

export default async function SubmitIssuePage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let recentIssues: Database['public']['Tables']['technical_issues']['Row'][] = [];
  if (session) {
    const { data } = await supabase
      .from('technical_issues')
      .select('*')
      .eq('reporter_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    recentIssues = data ?? [];
  }

  return (
    <div className="grid grid-2">
      <IssueForm />
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', color: 'var(--windsurf-muted)', marginBottom: 8 }}>
            Triage Expectations
          </p>
          <h2 style={{ margin: 0 }}>What happens next?</h2>
          <ol style={{ lineHeight: 1.8, color: 'var(--windsurf-slate)' }}>
            <li>Issue pings the reliability channel with severity metadata.</li>
            <li>Admins assign owners &amp; attach playbooks.</li>
            <li>Status changes reflect here and inside the dashboard.</li>
          </ol>
        </div>

        {session ? (
          <div>
            <h3 style={{ marginBottom: 8 }}>Your recent reports</h3>
            {recentIssues.length ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentIssues.map((issue) => (
                  <li key={issue.id} style={{ border: '1px solid var(--windsurf-border)', borderRadius: 10, padding: 12 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{issue.title}</p>
                    <p style={{ margin: 4, color: 'var(--windsurf-muted)', fontSize: '0.9rem' }}>Status: {issue.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--windsurf-muted)' }}>No submissions yet. Ship the first one to track here.</p>
            )}
          </div>
        ) : (
          <div style={{ background: 'rgba(65, 224, 255, 0.12)', borderRadius: 12, padding: 16 }}>
            <p style={{ margin: 0 }}>
              Submit issues anonymously. All reports are tracked in the dashboard for the engineering team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
