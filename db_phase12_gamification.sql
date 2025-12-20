-- Phase 12: Gamification
-- Badges and Streaks

-- 1. Badges Definition
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT, -- Or lucide icon name
    category TEXT DEFAULT 'achievement', -- 'course', 'streak', 'community'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Badges (Awards)
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}', -- Context (e.g., which course triggered it)
    UNIQUE(user_id, badge_id) -- Prevent duplicate awards
);

-- 3. Streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Public read user badges" ON public.user_badges FOR SELECT USING (true); -- Badge showcase
CREATE POLICY "Public read streaks" ON public.user_streaks FOR SELECT USING (true); -- Leaderboard

-- Function to update streak (Called by app logic or trigger on completion)
-- For now, we'll make a helper function
CREATE OR REPLACE FUNCTION update_user_streak(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    last_date DATE;
    curr_streak INTEGER;
BEGIN
    SELECT last_activity_date, current_streak INTO last_date, curr_streak
    FROM public.user_streaks
    WHERE user_id = target_user_id;

    IF NOT FOUND THEN
        INSERT INTO public.user_streaks (user_id, current_streak, last_activity_date)
        VALUES (target_user_id, 1, CURRENT_DATE);
        RETURN;
    END IF;

    -- If already updated today, do nothing
    IF last_date = CURRENT_DATE THEN
        RETURN;
    END IF;

    -- If updated yesterday, increment
    IF last_date = CURRENT_DATE - 1 THEN
        UPDATE public.user_streaks
        SET current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = target_user_id;
    ELSE
        -- Reset streak
        UPDATE public.user_streaks
        SET current_streak = 1,
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = target_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed Badges
INSERT INTO public.badges (slug, name, description, icon_url, category) VALUES
('first-steps', 'Primeros Pasos', 'Completaste tu primera clase.', 'footprints', 'achievement'),
('streak-3', 'Racha de Fuego', 'Estudiaste 3 días seguidos.', 'flame', 'streak'),
('math-whiz', 'Genio Matemático', 'Completaste el módulo de Matemáticas.', 'calculator', 'course'),
('community-voice', 'Voz de la Comunidad', 'Publicaste 5 comentarios.', 'message-circle', 'community')
ON CONFLICT (slug) DO NOTHING;
