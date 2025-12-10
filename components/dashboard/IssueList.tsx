import { formatDistanceToNow } from 'date-fns';
import StatusBadge from '@/components/ui/StatusBadge';
import { Database } from '@/types/database';
import { IssueSeverity } from '@/lib/constants';

const severityTone: Record<IssueSeverity, { label: string; color: string }> = {
  low: { label: 'Low', color: '#10b981' },
  medium: { label: 'Medium', color: '#f97316' },
  high: { label: 'High', color: '#ef4444' },
  critical: { label: 'Critical', color: '#be123c' },
};

export type IssueRecord = Database['public']['Tables']['technical_issues']['Row'];

type Props = {
  issues: IssueRecord[];
};

export default function IssueList({ issues }: Props) {
  if (!issues.length) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 32 }}>
        <p style={{ color: 'var(--windsurf-muted)' }}>No issues logged yet. Ship your first report to populate insights.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--windsurf-muted)', marginBottom: 4 }}>
            Active Issues
          </p>
          <h2 style={{ margin: 0 }}>Latest triage queue</h2>
        </div>
        <span style={{ color: 'var(--windsurf-muted)', fontSize: '0.9rem' }}>Showing {issues.length} most recent</span>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Category</th>
            <th>Reported</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>
                <strong>{issue.title}</strong>
                <p style={{ margin: 0, color: 'var(--windsurf-muted)', fontSize: '0.9rem' }}>{issue.description.slice(0, 120)}...</p>
              </td>
              <td>
                <span className="badge" style={{ background: `${severityTone[issue.severity].color}20`, color: severityTone[issue.severity].color }}>
                  {severityTone[issue.severity].label}
                </span>
              </td>
              <td>
                <StatusBadge status={issue.status} />
              </td>
              <td>{issue.category}</td>
              <td>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
