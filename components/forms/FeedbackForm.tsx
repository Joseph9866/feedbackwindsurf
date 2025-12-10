'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Loader2, MessageCircle, ShieldAlert } from 'lucide-react';
import { FEEDBACK_SENTIMENTS, FEEDBACK_CHANNELS } from '@/lib/constants';
import { FeedbackInsertSchema } from '@/lib/validation';

const FEEDBACK_CATEGORIES = ['Product', 'Process', 'Culture', 'Leadership', 'Enablement', 'Other'];

type FormState = {
  sentiment: (typeof FEEDBACK_SENTIMENTS)[number];
  category: string;
  message: string;
  channel: (typeof FEEDBACK_CHANNELS)[number];
  is_anonymous: boolean;
};

type ValidationErrors = Partial<Record<keyof FormState, string>> & { message?: string };

const initialState: FormState = {
  sentiment: 'neutral',
  category: FEEDBACK_CATEGORIES[0],
  message: '',
  channel: 'web',
  is_anonymous: true,
};

const toErrorMap = (issues: ReturnType<typeof FeedbackInsertSchema.safeParse>['error']) => {
  if (!issues) return {} as ValidationErrors;
  const fieldErrors = issues.flatten().fieldErrors;
  return Object.keys(fieldErrors).reduce((acc, key) => {
    const first = fieldErrors[key as keyof ValidationErrors]?.[0];
    if (first) acc[key as keyof ValidationErrors] = first;
    return acc;
  }, {} as ValidationErrors);
};

export default function FeedbackForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isValid = useMemo(() => formState.message.trim().length >= 8, [formState.message]);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = FeedbackInsertSchema.safeParse(formState);
    if (!parsed.success) {
      setErrors(toErrorMap(parsed.error));
      setStatusMessage({ type: 'error', message: 'Double-check the highlighted fields.' });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Unable to submit feedback');
      }

      setStatusMessage({ type: 'success', message: 'Feedback routed. Thanks for keeping Windsurf sharp.' });
      setFormState(initialState);
      setErrors({});
    } catch (error) {
      setStatusMessage({ type: 'error', message: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: 8, color: 'var(--windsurf-muted)' }}>
          Anonymous Feedback
        </p>
        <h2 style={{ margin: 0 }}>Feedback Drop Zone</h2>
        <p style={{ color: 'var(--windsurf-muted)', marginTop: 8 }}>
          Signal culture shifts, celebrate wins, or flag blockers. Insights route directly to the reliability council.
        </p>
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label htmlFor="sentiment">Sentiment</label>
          <select id="sentiment" value={formState.sentiment} onChange={(e) => handleChange('sentiment', e.target.value)}>
            {FEEDBACK_SENTIMENTS.map((sent) => (
              <option key={sent} value={sent}>
                {sent}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={formState.category} onChange={(e) => handleChange('category', e.target.value)}>
            {FEEDBACK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="channel">Channel</label>
        <select id="channel" value={formState.channel} onChange={(e) => handleChange('channel', e.target.value)}>
          {FEEDBACK_CHANNELS.map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" rows={4} value={formState.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="What should Windsurf leadership know?" required />
        {errors.message && <span className="form-error">{errors.message}</span>}
      </div>

      <label style={{ display: 'inline-flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
        <input type="checkbox" checked={formState.is_anonymous} onChange={(e) => handleChange('is_anonymous', e.target.checked)} />
        Keep me anonymous (default)
      </label>

      {statusMessage && (
        <div className={clsx('badge', statusMessage.type === 'success' ? 'success' : 'danger')}>
          {statusMessage.type === 'success' ? <MessageCircle size={16} /> : <ShieldAlert size={16} />} {statusMessage.message}
        </div>
      )}

      <button type="submit" className="btn-primary" disabled={!isValid || submitting}>
        {submitting ? <Loader2 size={16} className="spin" /> : null}
        Submit Feedback
      </button>
    </form>
  );
}
