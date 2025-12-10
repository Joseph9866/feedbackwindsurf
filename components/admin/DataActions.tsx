'use client';

import { useState } from 'react';
import { RefreshCw, Database, AlertCircle, CheckCircle } from 'lucide-react';

export default function DataActions() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const insertSampleData = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Insert sample issues
      const issuesResponse = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Sample Issue - ' + new Date().toLocaleTimeString(),
          description: 'This is a sample issue created from the admin panel to test data insertion.',
          category: 'Backend',
          severity: 'medium',
          environment: 'testing',
          expected_behavior: 'Should work correctly',
          tags: 'sample,test,admin'
        })
      });

      // Insert sample feedback
      const feedbackResponse = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentiment: 'positive',
          category: 'Product',
          message: 'Sample feedback created from admin panel at ' + new Date().toLocaleString(),
          channel: 'web',
          is_anonymous: true
        })
      });

      if (issuesResponse.ok && feedbackResponse.ok) {
        setMessage({ type: 'success', text: 'Sample data inserted successfully! Refresh the page to see changes.' });
      } else {
        throw new Error('Failed to insert sample data');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to insert sample data: ' + (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="card" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Admin Actions</h3>
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button
          onClick={insertSampleData}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          {loading ? <RefreshCw size={16} className="spin" /> : <Database size={16} />}
          Insert Sample Data
        </button>

        <button
          onClick={refreshPage}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <RefreshCw size={16} />
          Refresh Page
        </button>
      </div>

      {message && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          borderRadius: '6px',
          background: message.type === 'success' ? '#dcfce7' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          color: message.type === 'success' ? '#166534' : '#991b1b',
          fontSize: '14px'
        }}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}
    </div>
  );
}