-- Phase 11: Certifications Schema (Corrected)

CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    course_name TEXT NOT NULL,
    course_slug TEXT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    validation_code TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text) from 0 for 9) -- Simple 8-char code
);

-- RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Everyone can read certificates (for public verification)
CREATE POLICY "Public certificates read" ON public.certificates
    FOR SELECT USING (true);

-- Users can insert own certificates (for demo)
CREATE POLICY "Users can create own certificates" ON public.certificates
    FOR INSERT WITH CHECK (auth.uid() = user_id);
