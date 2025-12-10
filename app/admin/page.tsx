import IssueList from '@/components/dashboard/IssueList';
import FeedbackStream from '@/components/dashboard/FeedbackStream';
import SummaryCard from '@/components/dashboard/SummaryCard';
import DataActions from '@/components/admin/DataActions';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';

const FALLBACK_METRICS = {
  openIssues: 0,
  resolvedIssues: 0,
  feedbackCount: 0,
};

export const metadata = {
  title: 'Admin Dashboard • Windsurf Hub',
};

export default async function AdminDashboardPage() {
  const supabase = createServerSupabaseClient();
  
  // TEMPORARY: Allow access without authentication for testing
  // Remove this in production and uncomment the auth checks below
  
  /*
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if user is authenticated and is admin
  if (!session) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }
  */

  // Fetch data with better error handling
  const [issuesResult, feedbackResult, openCount, resolvedCount, feedbackCount] = await Promise.all([
    supabase
      .from('technical_issues')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20), // Increased limit to see more data
    supabase
      .from('feedback_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20), // Increased limit to see more data
    supabase.from('technical_issues').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('technical_issues').select('id', { count: 'exact', head: true }).eq('status', 'resolved'),
    supabase.from('feedback_entries').select('id', { count: 'exact', head: true }),
  ]);

  const issues = issuesResult.data || [];
  const feedback = feedbackResult.data || [];

  // Debug logging (remove in production)
  console.log('Issues query result:', issuesResult);
  console.log('Feedback query result:', feedbackResult);
  console.log('Issues count:', issues.length);
  console.log('Feedback count:', feedback.length);

  const metrics = {
    openIssues: openCount.count ?? FALLBACK_METRICS.openIssues,
    resolvedIssues: resolvedCount.count ?? FALLBACK_METRICS.resolvedIssues,
    feedbackCount: feedbackCount.count ?? FALLBACK_METRICS.feedbackCount,
  };

  return (
    <div className="grid" style={{ gap: 32 }}>
      <div>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', color: 'var(--windsurf-muted)', marginBottom: 8 }}>
          Admin Dashboard
        </p>
        <h1 style={{ margin: 0, fontSize: '2rem', marginBottom: 8 }}>Reliability Control Center</h1>
        <p style={{ color: 'var(--windsurf-muted)', margin: 0 }}>
          Monitor issues, review feedback, and manage the engineering triage pipeline.
        </p>
      </div>

      <section className="grid grid-3">
        <SummaryCard label="Open Issues" value={metrics.openIssues} helper="Active triage workload" accent="#41e0ff" />
        <SummaryCard label="Resolved This Week" value={metrics.resolvedIssues} helper="Shipped fixes" accent="#34d399" />
        <SummaryCard label="Feedback Intake" value={metrics.feedbackCount} helper="Signals captured" accent="#facc15" />
      </section>

      {/* Admin Actions */}
      <DataActions />

      {/* Debug Info - Remove in production */}
      <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Debug Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
          <div>
            <strong>Issues Found:</strong> {issues.length}
            <br />
            <strong>Issues Error:</strong> {issuesResult.error ? issuesResult.error.message : 'None'}
          </div>
          <div>
            <strong>Feedback Found:</strong> {feedback.length}
            <br />
            <strong>Feedback Error:</strong> {feedbackResult.error ? feedbackResult.error.message : 'None'}
          </div>
        </div>
        {issues.length === 0 && feedback.length === 0 && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#fef3c7', borderRadius: '6px' }}>
            <strong>No data found!</strong> Try the "Insert Sample Data" button above or run the SQL script in your Supabase dashboard.
          </div>
        )}
      </div>

      <IssueList issues={issues} />
      <FeedbackStream items={feedback} />
    </div>
  );
}