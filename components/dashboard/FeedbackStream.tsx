import { formatDistanceToNow } from 'date-fns';
import { Database } from '@/types/database';

export type FeedbackRecord = Database['public']['Tables']['feedback_entries']['Row'];

type Props = {
  items: FeedbackRecord[];
};

const sentimentColor: Record<FeedbackRecord['sentiment'], string> = {
  positive: '#10b981',
  neutral: '#6366f1',
  negative: '#ef4444',
};

export default function FeedbackStream({ items }: Props) {
  if (!items.length) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <p style={{ margin: 0, color: 'var(--windsurf-muted)' }}>No feedback captured yet.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: 4, color: 'var(--windsurf-muted)' }}>
          Latest Anonymous Signals
        </p>
        <h2 style={{ margin: 0 }}>Feedback Stream</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: '1px solid var(--windsurf-border)', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>{item.category}</span>
              <span style={{ color: sentimentColor[item.sentiment], fontWeight: 600, textTransform: 'capitalize' }}>
                {item.sentiment}
              </span>
            </div>
            <p style={{ margin: '8px 0', color: 'var(--windsurf-slate)' }}>{item.message}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--windsurf-muted)', fontSize: '0.85rem' }}>
              <span>{item.channel}</span>
              <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
