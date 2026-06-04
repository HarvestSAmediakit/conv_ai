-- ConvoMag Database Schema for Supabase

-- Publications (magazines, newspapers)
CREATE TABLE publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#000000',
    secondary_color TEXT DEFAULT '#ffffff',
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issues (each edition of a publication)
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID REFERENCES publications(id) ON DELETE CASCADE,
    issue_number TEXT,
    issue_date DATE,
    title TEXT,
    pdf_url TEXT NOT NULL,
    cover_image_url TEXT,
    page_count INTEGER,
    status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
    
    -- AI Configuration
    ai_name TEXT,
    ai_voice_id TEXT,
    ai_introduction TEXT,
    
    -- Embed Configuration  
    embed_enabled BOOLEAN DEFAULT true,
    embed_slug TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles extracted from issues
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT,
    page_start INTEGER,
    page_end INTEGER,
    section TEXT,
    content TEXT,
    summary TEXT,
    keywords TEXT[],
    
    -- Podcast Configuration
    podcast_audio_url TEXT,
    podcast_duration_seconds INTEGER,
    podcast_status TEXT DEFAULT 'pending',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advertisers in issues
CREATE TABLE advertisers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    page_number INTEGER,
    ad_type TEXT CHECK (ad_type IN ('display', 'classified', 'advertorial', 'native')),
    product_name TEXT,
    product_description TEXT,
    offer_text TEXT,
    offer_code TEXT,
    offer_deadline DATE,
    cta_url TEXT,
    
    -- Usage Advice (AI-generated)
    usage_advice TEXT,
    target_audience TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Publication Voice Presets
CREATE TABLE voice_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    accent TEXT NOT NULL,
    language TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'neutral')),
    description TEXT,
    preview_url TEXT,
    elevenlabs_voice_id TEXT,
    is_premium BOOLEAN DEFAULT false
);

-- User Interactions (analytics)
CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    session_id TEXT,
    interaction_type TEXT CHECK (interaction_type IN ('page_flip', 'article_read', 'podcast_play', 'podcast_interrupt', 'chat_message', 'advertiser_click', 'search')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_issues_publication ON issues(publication_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_articles_issue ON articles(issue_id);
CREATE INDEX idx_advertisers_issue ON advertisers(issue_id);
CREATE INDEX idx_interactions_issue ON interactions(issue_id);
CREATE INDEX idx_interactions_session ON interactions(session_id);
