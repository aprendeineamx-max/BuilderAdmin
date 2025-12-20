-- Phase 18: Mailing
-- Table: subscribers

CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'blog',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anon to only insert (subscribe)
CREATE POLICY "Anon can subscribe"
    ON public.subscribers
    FOR INSERT
    WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view subscribers"
    ON public.subscribers
    FOR SELECT
    USING (auth.role() = 'service_role');
