-- Creator Studio & Content Management
-- 1. Course Drafts (Work in progress courses)
-- This allows instructors to work on content without affection live "clases_generadas"
CREATE TABLE IF NOT EXISTS public.course_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    status TEXT DEFAULT 'draft', -- draft, review, published
    metadata JSONB DEFAULT '{}', -- Flexible structure for curriculum
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Media Library (For reusable assets)
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT, -- image/png, video/mp4, application/pdf
    size_bytes BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Update Users to support Roles (if not already fully robust)
-- Adding a check constraint or specific role column if needed.
-- For now, we assume public.usuarios might just use a metadata field or we add specific table.
-- Let's stick to existing schema but ensure we have RLS policies for "instructors".

-- RLS
ALTER TABLE public.course_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Policies

-- Drafts: Instructor can only see their own drafts
CREATE POLICY "Instructors own drafts" ON public.course_drafts
    FOR ALL
    USING (auth.uid() = instructor_id);

-- Media: Instructors see their own media (or public media?)
-- Let's allow instructors to see their own media.
CREATE POLICY "Instructors own media" ON public.media_library
    FOR ALL
    USING (auth.uid() = uploader_id);

-- Add column to users if not exists (handling idempotency in logic or just manual check)
-- Ideally we would alter table here but standard SQL scripts might fail if column exists.
-- We will manage roles via the 'profiles' or 'usuarios' metadata mainly.

-- NOTIFY TRIGGER (Optional, for draft updates)
