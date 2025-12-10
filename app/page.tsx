import ActionButton from '@/components/ui/ActionButton';
import { BarChart3, Users, Zap, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 48 }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '48px 0' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 700, 
          margin: '0 0 16px 0',
          background: 'linear-gradient(135deg, #0b1f3a, #1a73e8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Windsurf Reliability Hub
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--windsurf-muted)', 
          maxWidth: '600px', 
          margin: '0 auto 32px auto',
          lineHeight: 1.6
        }}>
          High-velocity triage portal for capturing bugs and anonymous insights. 
          Help improve Windsurf by reporting issues and sharing feedback.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <ActionButton href="/submit-issue" variant="primary" icon="alert">
            Report an Issue
          </ActionButton>
          
          <ActionButton href="/feedback" variant="secondary" icon="message">
            Share Feedback
          </ActionButton>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-3" style={{ gap: 24 }}>
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #fef3c7, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Zap size={32} color="#92400e" />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Fast Triage</h3>
          <p style={{ color: 'var(--windsurf-muted)', margin: 0, lineHeight: 1.5 }}>
            Issues ping the reliability channel with severity metadata for rapid response.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #dbeafe, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Users size={32} color="#1e40af" />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Anonymous Feedback</h3>
          <p style={{ color: 'var(--windsurf-muted)', margin: 0, lineHeight: 1.5 }}>
            Share insights anonymously to help improve culture and processes.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #dcfce7, #22c55e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <BarChart3 size={32} color="#15803d" />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Progress Tracking</h3>
          <p style={{ color: 'var(--windsurf-muted)', margin: 0, lineHeight: 1.5 }}>
            Track status changes and see how your reports contribute to improvements.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', margin: '0 0 32px 0' }}>How It Works</h2>
        <div className="grid grid-2" style={{ gap: 32, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: '#1a73e8', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '14px'
              }}>1</div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Report Issues</h3>
            </div>
            <p style={{ color: 'var(--windsurf-muted)', lineHeight: 1.6, margin: '0 0 24px 44px' }}>
              Submit technical issues with detailed context, severity levels, and reproduction steps.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: '#1a73e8', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '14px'
              }}>2</div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Share Feedback</h3>
            </div>
            <p style={{ color: 'var(--windsurf-muted)', lineHeight: 1.6, margin: '0 0 24px 44px' }}>
              Provide anonymous insights about processes, culture, or product improvements.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: '#1a73e8', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '14px'
              }}>3</div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Track Progress</h3>
            </div>
            <p style={{ color: 'var(--windsurf-muted)', lineHeight: 1.6, margin: '0 0 0 44px' }}>
              Watch as the engineering team triages, assigns, and resolves your submissions.
            </p>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Shield size={24} color="#1a73e8" />
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Privacy First</h3>
            </div>
            <p style={{ color: 'var(--windsurf-muted)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              No account required. Submit issues and feedback completely anonymously. 
              Your privacy is protected while helping improve Windsurf for everyone.
            </p>
            <ul style={{ color: 'var(--windsurf-muted)', lineHeight: 1.6, margin: 0, paddingLeft: '20px' }}>
              <li>Anonymous submissions by default</li>
              <li>No personal data collection</li>
              <li>Secure and encrypted communication</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
