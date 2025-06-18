-- Insert sample users
INSERT INTO users (name, email, role) VALUES
('Alice Johnson', 'alice@example.com', 'Debater'),
('Bob Smith', 'bob@example.com', 'Debater'),
('Carol Admin', 'carol@example.com', 'Admin');

-- Insert sample tags
INSERT INTO tags (label, color) VALUES
('Climate Change', '#10B981'),
('Economics', '#3B82F6'),
('Healthcare', '#EF4444'),
('Technology', '#8B5CF6'),
('Education', '#F59E0B'),
('Policy', '#6B7280');

-- Insert sample prep bank entries
WITH user_alice AS (SELECT id FROM users WHERE email = 'alice@example.com'),
     user_bob AS (SELECT id FROM users WHERE email = 'bob@example.com')

-- Evidence Cards
INSERT INTO prep_bank_entries (
    title, summary, author_id, entry_type, quote_text, source_url, 
    mla_citation, author_qualifications, warrant_text
) VALUES
(
    'Climate Change Economic Impact Study',
    'Comprehensive analysis of economic costs of climate change',
    (SELECT id FROM user_alice),
    'Evidence',
    'Climate change will cost the global economy $43 trillion by 2100 if current trends continue, with developing nations bearing disproportionate burden.',
    'https://example.com/climate-study',
    'Smith, John. "Economic Impacts of Climate Change." Nature Climate Change, vol. 15, no. 3, 2023, pp. 45-62.',
    'Dr. John Smith is a professor of Environmental Economics at MIT with 20 years of research experience.',
    'This evidence demonstrates the urgent need for climate action from an economic perspective, showing that inaction costs more than prevention.'
),

-- Analytics Entry
(
    'Debate Strategy: Climate Arguments',
    'Analysis of effective climate change argumentation strategies',
    (SELECT id FROM user_bob),
    'Analytics',
    NULL, NULL, NULL, NULL, NULL
) ;

-- Update the analytics entry with content
UPDATE prep_bank_entries 
SET content = 'When arguing climate change impacts, focus on: 1) Economic costs (quantified impacts), 2) Timeframe urgency (tipping points), 3) Disproportionate effects on vulnerable populations. Counter-arguments typically focus on economic costs of action - prepare responses about green job creation and innovation benefits.'
WHERE entry_type = 'Analytics' AND title = 'Debate Strategy: Climate Arguments';

-- Literature Definition
WITH user_alice AS (SELECT id FROM users WHERE email = 'alice@example.com')
INSERT INTO prep_bank_entries (
    title, summary, author_id, entry_type, definition_text
) VALUES
(
    'Carbon Pricing Definition',
    'Comprehensive definition of carbon pricing mechanisms',
    (SELECT id FROM user_alice),
    'Definition',
    'Carbon pricing is an economic instrument that captures the external costs of greenhouse gas emissions. It provides incentives for emitters to reduce their emissions and invest in cleaner alternatives.'
);

-- Create some tag associations
WITH climate_tag AS (SELECT id FROM tags WHERE label = 'Climate Change'),
     econ_tag AS (SELECT id FROM tags WHERE label = 'Economics'),
     evidence_entry AS (SELECT id FROM prep_bank_entries WHERE title = 'Climate Change Economic Impact Study'),
     analytics_entry AS (SELECT id FROM prep_bank_entries WHERE title = 'Debate Strategy: Climate Arguments'),
     definition_entry AS (SELECT id FROM prep_bank_entries WHERE title = 'Carbon Pricing Definition')

INSERT INTO prep_bank_entry_tags (prep_bank_entry_id, tag_id) VALUES
((SELECT id FROM evidence_entry), (SELECT id FROM climate_tag)),
((SELECT id FROM evidence_entry), (SELECT id FROM econ_tag)),
((SELECT id FROM analytics_entry), (SELECT id FROM climate_tag)),
((SELECT id FROM definition_entry), (SELECT id FROM climate_tag)),
((SELECT id FROM definition_entry), (SELECT id FROM econ_tag));

-- Insert sample case template
WITH user_alice AS (SELECT id FROM users WHERE email = 'alice@example.com'),
     evidence_id AS (SELECT id FROM prep_bank_entries WHERE title = 'Climate Change Economic Impact Study'),
     definition_id AS (SELECT id FROM prep_bank_entries WHERE title = 'Carbon Pricing Definition')

INSERT INTO case_templates (name, description, card_sequence, created_by) VALUES
(
    'Climate Action Affirmative Case',
    'Standard affirmative case structure for climate change resolutions',
    ARRAY[(SELECT id FROM evidence_id), (SELECT id FROM definition_id)],
    (SELECT id FROM user_alice)
);

-- Insert sample round and flow logs
WITH user_alice AS (SELECT id FROM users WHERE email = 'alice@example.com')
INSERT INTO rounds (user_id) VALUES ((SELECT id FROM user_alice));

WITH current_round AS (SELECT id FROM rounds ORDER BY start_time DESC LIMIT 1),
     evidence_entry AS (SELECT id FROM prep_bank_entries WHERE title = 'Climate Change Economic Impact Study')

INSERT INTO round_prep_entries (entry_id, round_id) VALUES
((SELECT id FROM evidence_entry), (SELECT id FROM current_round));

INSERT INTO flow_logs (round_id, entry_id, action) VALUES
((SELECT id FROM current_round), (SELECT id FROM evidence_entry), 'Added');
