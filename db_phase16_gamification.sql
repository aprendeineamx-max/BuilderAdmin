-- Gamification V2: Economy & Leagues

-- 1. Virtual Currency (Wallet)
CREATE TABLE IF NOT EXISTS public.user_wallets (
    user_id UUID PRIMARY KEY REFERENCES public.usuarios(id) ON DELETE CASCADE,
    xp_coins INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Shop Items (Avatar parts, themes, streaks)
CREATE TABLE IF NOT EXISTS public.shop_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    category TEXT NOT NULL, -- 'avatar', 'theme', 'powerup'
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Inventory
CREATE TABLE IF NOT EXISTS public.user_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.shop_items(id) ON DELETE CASCADE,
    is_equipped BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Leagues (Weekly Competition)
CREATE TABLE IF NOT EXISTS public.leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- 'Bronce', 'Plata', 'Oro', 'Diamante'
    min_xp INTEGER NOT NULL,
    icon TEXT,
    rank_order INTEGER NOT NULL UNIQUE -- 1=Bronze, 2=Silver...
);

-- 5. League Members (Current status)
CREATE TABLE IF NOT EXISTS public.league_members (
    user_id UUID PRIMARY KEY REFERENCES public.usuarios(id) ON DELETE CASCADE,
    league_id UUID REFERENCES public.leagues(id),
    current_xp INTEGER DEFAULT 0, -- XP earned this week
    weekly_rank INTEGER,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Read Own Wallet" ON public.user_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public Read Shop" ON public.shop_items FOR SELECT USING (true);
CREATE POLICY "Read Own Inventory" ON public.user_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public Read Leagues" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "Public Read League Members" ON public.league_members FOR SELECT USING (true);

-- Seed Data (Leagues)
INSERT INTO public.leagues (name, min_xp, icon, rank_order) VALUES
('Bronce', 0, '🥉', 1),
('Plata', 500, '🥈', 2),
('Oro', 1500, '🥇', 3),
('Diamante', 5000, '💎', 4)
ON CONFLICT (rank_order) DO UPDATE SET name = EXCLUDED.name; -- Update names if needed but keep ID

-- Seed Data (Shop Items)
INSERT INTO public.shop_items (name, description, cost, category, image_url) VALUES
('Racha Congelada', 'Protege tu racha por un día si olvidas estudiar.', 200, 'powerup', '❄️'),
('Traje Espacial', 'Avatar exclusivo de astronauta.', 1000, 'avatar', '👨‍🚀'),
('Modo Oscuro Neón', 'Tema de colores cyberpunk para tu perfil.', 500, 'theme', '🌆'),
('Doble XP Pot', 'Gana doble experiencia por 30 minutos.', 150, 'powerup', '🧪')
ON CONFLICT DO NOTHING; -- No unique constraint on name, relying on random UUIDs, so this might duplicate if run multiple times without cleanup. Ideally use slug/name unique.

-- Only insert wallets for existing users who don't have one
INSERT INTO public.user_wallets (user_id, xp_coins)
SELECT id, 100 FROM public.usuarios
ON CONFLICT (user_id) DO NOTHING;
