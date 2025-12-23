-- Community & Social Features
-- 1. Forum Categories (Can be linked to Courses)
CREATE TABLE IF NOT EXISTS public.forum_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- Emoji
    slug TEXT UNIQUE NOT NULL,
    curso_id BIGINT REFERENCES public.clases_generadas(id), -- Optional link to specific course
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Forum Threads
CREATE TABLE IF NOT EXISTS public.forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.forum_categories(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Markdown support
    views INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Thread Comments
CREATE TABLE IF NOT EXISTS public.forum_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.forum_comments(id), -- For nested replies
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Followers (Graph)
CREATE TABLE IF NOT EXISTS public.user_followers (
    follower_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- 5. Activity Feed
CREATE TABLE IF NOT EXISTS public.activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE, -- Who did the action
    action_type TEXT NOT NULL, -- 'completed_lesson', 'earned_badge', 'posted_thread'
    target_id UUID, -- ID of the object (lesson_id, badge_id, etc.)
    metadata JSONB DEFAULT '{}', -- Extra info (e.g. lesson title)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Public Read
CREATE POLICY "Public Read Categories" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Threads" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "Public Read Comments" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "Public Read Feed" ON public.activity_feed FOR SELECT USING (true);

-- Auth Write
CREATE POLICY "Auth Create Thread" ON public.forum_threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Auth Create Comment" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Auth Follow" ON public.user_followers FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Auth Unfollow" ON public.user_followers FOR DELETE USING (auth.uid() = follower_id);

-- SEED DATA (Categories)
INSERT INTO public.forum_categories (title, description, icon, slug) VALUES 
('General', 'Discusión general sobre la comunidad', '💬', 'general'),
('Ayuda con Tareas', '¿Atorado con una lección? Pregunta aquí.', '🆘', 'ayuda-tareas'),
('Proyectos y Logros', 'Presume tus certificados y avances.', '🏆', 'proyectos')
ON CONFLICT (slug) DO NOTHING;
