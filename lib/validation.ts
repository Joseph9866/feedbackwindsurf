import { z } from 'zod';
import { ISSUE_SEVERITIES, FEEDBACK_SENTIMENTS, FEEDBACK_CHANNELS } from './constants';

export const IssueInsertSchema = z.object({
  title: z.string().min(4, 'Give the issue a descriptive title'),
  description: z.string().min(10, 'Include enough detail for triage'),
  category: z.string().min(2, 'Category is required'),
  severity: z.enum(ISSUE_SEVERITIES),
  environment: z.string().max(120).optional().or(z.literal('')).transform((val) => val || null),
  tags: z
    .string()
    .max(120)
    .optional()
    .transform((val) =>
      val
        ?.split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8) ?? null
    ),
  expected_behavior: z.string().optional().or(z.literal('')).transform((val) => val || null),
  attachment_url: z
    .string()
    .url('Provide a valid URL')
    .optional()
    .or(z.literal(''))
    .transform((val) => val || null),
});

export const FeedbackInsertSchema = z.object({
  sentiment: z.enum(FEEDBACK_SENTIMENTS),
  category: z.string().min(2),
  message: z.string().min(8, 'Please provide actionable feedback'),
  channel: z.enum(FEEDBACK_CHANNELS).default('web'),
  is_anonymous: z.boolean().default(true),
});

export type IssueInsertPayload = z.infer<typeof IssueInsertSchema>;
export type FeedbackInsertPayload = z.infer<typeof FeedbackInsertSchema>;
