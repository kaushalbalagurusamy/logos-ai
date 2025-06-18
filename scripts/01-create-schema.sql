-- Create ENUM types
CREATE TYPE user_role AS ENUM ('Debater', 'Admin');
CREATE TYPE prep_bank_entry_type AS ENUM ('Evidence', 'Analytics', 'Definition', 'SLR', 'MetaStudy');
CREATE TYPE flow_action AS ENUM ('Added', 'Dropped', 'Cited');

-- Create Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'Debater',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6'
);

-- Create PrepBankEntry table (base table for inheritance)
CREATE TABLE prep_bank_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_type prep_bank_entry_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Evidence-specific fields
    quote_text TEXT,
    source_url TEXT,
    pdf_url TEXT,
    mla_citation TEXT,
    author_qualifications TEXT,
    methodology_details TEXT,
    warrant_text TEXT,
    
    -- Analytics-specific fields
    content TEXT,
    
    -- Definition-specific fields
    definition_text TEXT,
    clustered_card_ids UUID[],
    
    -- SLR/MetaStudy-specific fields
    nodes JSONB,
    edges JSONB,
    
    -- Constraints to ensure proper field usage based on entry_type
    CONSTRAINT evidence_fields_check CHECK (
        (entry_type = 'Evidence' AND quote_text IS NOT NULL) OR
        (entry_type != 'Evidence' AND quote_text IS NULL)
    ),
    CONSTRAINT analytics_fields_check CHECK (
        (entry_type = 'Analytics' AND content IS NOT NULL) OR
        (entry_type != 'Analytics' AND content IS NULL)
    ),
    CONSTRAINT definition_fields_check CHECK (
        (entry_type = 'Definition' AND definition_text IS NOT NULL) OR
        (entry_type != 'Definition' AND definition_text IS NULL)
    ),
    CONSTRAINT slr_fields_check CHECK (
        (entry_type IN ('SLR', 'MetaStudy') AND nodes IS NOT NULL AND edges IS NOT NULL) OR
        (entry_type NOT IN ('SLR', 'MetaStudy') AND nodes IS NULL AND edges IS NULL)
    )
);

-- Create junction table for PrepBankEntry-Tag many-to-many relationship
CREATE TABLE prep_bank_entry_tags (
    prep_bank_entry_id UUID REFERENCES prep_bank_entries(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (prep_bank_entry_id, tag_id)
);

-- Create CaseTemplate table
CREATE TABLE case_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    card_sequence UUID[] DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Round table
CREATE TABLE rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE
);

-- Create RoundPrepEntry table
CREATE TABLE round_prep_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID NOT NULL REFERENCES prep_bank_entries(id) ON DELETE CASCADE,
    round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FlowLog table
CREATE TABLE flow_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    entry_id UUID NOT NULL REFERENCES prep_bank_entries(id) ON DELETE CASCADE,
    action flow_action NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create JudgeProfile table
CREATE TABLE judge_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judge_name VARCHAR(255) NOT NULL,
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OpponentProfile table
CREATE TABLE opponent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opponent_name VARCHAR(255) NOT NULL,
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_prep_bank_entries_author ON prep_bank_entries(author_id);
CREATE INDEX idx_prep_bank_entries_type ON prep_bank_entries(entry_type);
CREATE INDEX idx_prep_bank_entries_created ON prep_bank_entries(created_at DESC);
CREATE INDEX idx_tags_label ON tags(label);
CREATE INDEX idx_flow_logs_round_timestamp ON flow_logs(round_id, timestamp DESC);
CREATE INDEX idx_round_prep_entries_round ON round_prep_entries(round_id);

-- Create full-text search indexes
CREATE INDEX idx_prep_bank_entries_search ON prep_bank_entries USING gin(
    to_tsvector('english', 
        COALESCE(title, '') || ' ' || 
        COALESCE(summary, '') || ' ' || 
        COALESCE(quote_text, '') || ' ' || 
        COALESCE(content, '') || ' ' || 
        COALESCE(definition_text, '')
    )
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_prep_bank_entries_updated_at 
    BEFORE UPDATE ON prep_bank_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
