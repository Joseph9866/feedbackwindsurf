-- Sample data for Windsurf Issue & Feedback Hub
-- Run this in your Supabase SQL Editor to populate with test data

-- Insert sample technical issues
INSERT INTO technical_issues (title, description, category, severity, status, environment, expected_behavior, tags) VALUES
('API timeout on user authentication', 'Users experiencing 30+ second delays when logging in through OAuth providers. Affects approximately 15% of login attempts during peak hours.', 'Backend', 'high', 'open', 'production', 'Login should complete within 2-3 seconds', ARRAY['auth', 'performance', 'oauth']),

('Dashboard charts not loading', 'Analytics dashboard shows blank charts for users in EU region. Console shows CORS errors when fetching data from analytics API.', 'Frontend', 'medium', 'in_progress', 'production-eu', 'Charts should display user analytics data', ARRAY['frontend', 'cors', 'analytics']),

('Memory leak in background worker', 'Background job processor consuming increasing amounts of RAM over time. Server requires restart every 6 hours to prevent crashes.', 'Infrastructure', 'critical', 'open', 'production', 'Memory usage should remain stable', ARRAY['memory', 'worker', 'infrastructure']),

('Mobile app crashes on file upload', 'iOS app crashes when users try to upload files larger than 10MB. Android version works fine with same files.', 'Mobile', 'high', 'resolved', 'production', 'Should handle files up to 50MB without crashing', ARRAY['mobile', 'ios', 'upload']),

('Search results pagination broken', 'Search results page shows "Page 1 of undefined" and next/previous buttons don''t work. Affects all search queries.', 'Frontend', 'medium', 'open', 'staging', 'Pagination should show correct page numbers and navigation', ARRAY['search', 'pagination', 'ui']);

-- Insert sample feedback entries
INSERT INTO feedback_entries (sentiment, category, message, channel, is_anonymous) VALUES
('positive', 'Product', 'The new code completion feature is incredibly fast and accurate. It''s saving me hours every day and the suggestions are contextually relevant.', 'web', true),

('negative', 'Process', 'The deployment process is too complex and error-prone. We need better automation and clearer documentation for the CI/CD pipeline.', 'web', true),

('neutral', 'Culture', 'Team communication has improved with the new Slack channels, but we could use more structured async updates for remote team members.', 'web', true),

('positive', 'Leadership', 'Really appreciate the transparency in the recent all-hands meeting. The roadmap clarity helps us prioritize our work better.', 'web', true),

('negative', 'Enablement', 'The onboarding process for new developers is outdated. Many of the setup instructions don''t work with current versions of our tools.', 'web', true),

('positive', 'Product', 'Love the new dark mode theme! The contrast is perfect and it''s much easier on the eyes during long coding sessions.', 'web', true);

-- Show summary of inserted data
SELECT 'Technical Issues' as table_name, COUNT(*) as record_count FROM technical_issues
UNION ALL
SELECT 'Feedback Entries' as table_name, COUNT(*) as record_count FROM feedback_entries;