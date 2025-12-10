import FeedbackForm from '@/components/forms/FeedbackForm';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { Database } from '@/types/database';

export const metadata = {
  title: 'Anonymous Feedback • Windsurf Hub',
};

export default async function FeedbackPage() {
  const supabase = createServerSupabaseClient();

  // Get recent feedback entries to show activity
  const { data: recentFeedback } = await supabase
    .from('feedback_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  const feedbackList = recentFeedback || [];

  return (
    <div className="grid grid-2">
      <FeedbackForm />
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', color: 'var(--windsurf-muted)', marginBottom: 8 }}>
            Feedback Pipeline
          </p>
          <h2 style={{ margin: 0 }}>How feedback flows</h2>
          <ol style={{ lineHeight: 1.8, color: 'var(--windsurf-slate)' }}>
            <li>Anonymous insights route directly to leadership.</li>
            <li>Patterns get analyzed for culture and process improvements.</li>
            <li>High-impact feedback triggers immediate action items.</li>
          </ol>
        </div>

        <div>
          <h3 style={{ marginBottom: 16 }}>Recent Community Insights</h3>
          {feedbackList.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {feedbackList.map((feedback) => (
                <div 
                  key={feedback.id} 
                  style={{ 
                    border: '1px solid var(--windsurf-border)', 
                    borderRadius: 10, 
                    padding: 16,
                    background: 'var(--windsurf-card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span 
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: feedback.sentiment === 'positive' ? '#dcfce7' : 
                                   feedback.sentiment === 'negative' ? '#fef2f2' : '#f1f5f9',
                        color: feedback.sentiment === 'positive' ? '#166534' : 
                               feedback.sentiment === 'negative' ? '#991b1b' : '#475569'
                      }}
                    >
                      {feedback.sentiment}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--windsurf-muted)' }}>
                      {feedback.category}
                    </span>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.9rem', 
                    lineHeight: 1.5,
                    color: 'var(--windsurf-text)'
                  }}>
                    {feedback.message.length > 120 
                      ? `${feedback.message.substring(0, 120)}...` 
                      : feedback.message
                    }
                  </p>
                  <p style={{ 
                    margin: '8px 0 0 0', 
                    fontSize: '0.75rem', 
                    color: 'var(--windsurf-muted)' 
                  }}>
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              background: 'rgba(65, 224, 255, 0.12)', 
              borderRadius: 12, 
              padding: 16,
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: 'var(--windsurf-muted)' }}>
                Be the first to share feedback! Your insights help shape Windsurf's future.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}