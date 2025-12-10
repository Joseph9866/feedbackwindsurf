export const ISSUE_CATEGORIES = [
  'API',
  'UI/UX',
  'Infrastructure',
  'Performance',
  'Security',
  'Data Integrity',
  'Developer Experience',
] as const;
export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export const ISSUE_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;
export type IssueSeverity = (typeof ISSUE_SEVERITIES)[number];

export const ISSUE_STATUSES = ['open', 'in_progress', 'resolved', 'blocked'] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const FEEDBACK_SENTIMENTS = ['positive', 'neutral', 'negative'] as const;
export type FeedbackSentiment = (typeof FEEDBACK_SENTIMENTS)[number];

export const FEEDBACK_CHANNELS = ['web', 'slack', 'email', 'other'] as const;
export type FeedbackChannel = (typeof FEEDBACK_CHANNELS)[number];
