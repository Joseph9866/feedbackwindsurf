'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Loader2, CheckCircle2, AlertCircle, Paperclip } from 'lucide-react';
import { ISSUE_CATEGORIES, ISSUE_SEVERITIES } from '@/lib/constants';
import { IssueInsertSchema } from '@/lib/validation';

type FormState = {
  title: string;
  description: string;
  category: string;
  severity: (typeof ISSUE_SEVERITIES)[number];
  environment: string;
  expected_behavior: string;
  tags: string;
  attachment_url: string;
};

type ValidationErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  title: '',
  description: '',
  category: ISSUE_CATEGORIES[0],
  severity: ISSUE_SEVERITIES[1],
  environment: '',
  expected_behavior: '',
  tags: '',
  attachment_url: '',
};

const toErrorMap = (issues: ReturnType<typeof IssueInsertSchema.safeParse>['error']) => {
  if (!issues) return {} as ValidationErrors;
  const fieldErrors = issues.flatten().fieldErrors;
  return Object.keys(fieldErrors).reduce((acc, key) => {
    const first = fieldErrors[key as keyof ValidationErrors]?.[0];
    if (first) acc[key as keyof ValidationErrors] = first;
    return acc;
  }, {} as ValidationErrors);
};

export default function IssueForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const result = IssueInsertSchema.safeParse(formState);
    if (result.success) {
      setErrors({});
    } else {
      setErrors(toErrorMap(result.error));
    }
  }, [formState]);

  const isValid = useMemo(() => Object.keys(errors).length === 0 && formState.title && formState.description, [errors, formState]);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = IssueInsertSchema.safeParse(formState);
    if (!parsed.success) {
      setErrors(toErrorMap(parsed.error));
      setStatusMessage({ type: 'error', message: 'Fix validation errors before submitting.' });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Unable to submit issue');
      }

      setStatusMessage({ type: 'success', message: 'Issue submitted. Track progress from the dashboard.' });
      setFormState(initialState);
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
          Submit Technical Issue
        </p>
        <h2 style={{ margin: 0 }}>Rapid Issue Intake</h2>
        <p style={{ color: 'var(--windsurf-muted)', marginTop: 8 }}>Give the engineering triage squad enough context to reproduce and prioritize.</p>
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" value={formState.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Example: API 500s on invoice mutation" required />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={formState.category} onChange={(e) => handleChange('category', e.target.value)}>
            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label htmlFor="severity">Severity</label>
          <select id="severity" value={formState.severity} onChange={(e) => handleChange('severity', e.target.value)}>
            {ISSUE_SEVERITIES.map((sev) => (
              <option key={sev} value={sev}>
                {sev}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="environment">Environment</label>
          <input id="environment" value={formState.environment} onChange={(e) => handleChange('environment', e.target.value)} placeholder="prod-eu-west-1" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" rows={4} value={formState.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Steps to reproduce, observed behavior, stack traces" required />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="expected_behavior">Expected Behavior</label>
        <textarea id="expected_behavior" rows={3} value={formState.expected_behavior} onChange={(e) => handleChange('expected_behavior', e.target.value)} placeholder="What should have happened?" />
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input id="tags" value={formState.tags} onChange={(e) => handleChange('tags', e.target.value)} placeholder="billing, graphql, regression" />
        </div>
        <div className="form-group">
          <label htmlFor="attachment_url">Attachment URL</label>
          <div style={{ position: 'relative' }}>
            <Paperclip size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--windsurf-muted)' }} />
            <input style={{ paddingLeft: 36 }} id="attachment_url" value={formState.attachment_url} onChange={(e) => handleChange('attachment_url', e.target.value)} placeholder="https://link.to/logs" />
          </div>
          {errors.attachment_url && <span className="form-error">{errors.attachment_url}</span>}
        </div>
      </div>

      {statusMessage && (
        <div className={clsx('badge', statusMessage.type === 'success' ? 'success' : 'danger')}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {statusMessage.message}
        </div>
      )}

      <button type="submit" className="btn-primary" disabled={!isValid || submitting}>
        {submitting ? <Loader2 size={16} className="spin" /> : null}
        Launch Issue Intake
      </button>
    </form>
  );
}
