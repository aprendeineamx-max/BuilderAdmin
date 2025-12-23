-- Learning Paths (Rutas)
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT, -- Emoji or URL
    color_theme TEXT DEFAULT 'blue',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Path Steps (Nodos del Mapa)
CREATE TABLE IF NOT EXISTS public.path_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    step_order INTEGER NOT NULL, -- 1, 2, 3...
    node_type TEXT NOT NULL CHECK (node_type IN ('course', 'quiz', 'milestone', 'video')),
    
    -- Reference to actual content (nullable depending on type)
    curso_id BIGINT REFERENCES public.clases_generadas(id), -- If it links to a course/class
    
    position_x INTEGER DEFAULT 0, -- For visual mapping (Canvas/SVG)
    position_y INTEGER DEFAULT 0, -- For visual mapping
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress on Paths
CREATE TABLE IF NOT EXISTS public.user_path_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    
    completed_nodes UUID[] DEFAULT '{}', -- Array of completed node IDs
    current_node_id UUID REFERENCES public.path_nodes(id),
    
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    UNIQUE(user_id, path_id)
);

-- RLS Policies
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.path_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_path_progress ENABLE ROW LEVEL SECURITY;

-- Public Read for Definitions
CREATE POLICY "Public Read Paths" ON public.learning_paths FOR SELECT USING (true);
CREATE POLICY "Public Read Nodes" ON public.path_nodes FOR SELECT USING (true);

-- User Private Progress
CREATE POLICY "User View Own Progress" ON public.user_path_progress 
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "User Update Own Progress" ON public.user_path_progress 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "User Insert Own Progress" ON public.user_path_progress 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed Data (Ruta Demo: "Primaria Express")
INSERT INTO public.learning_paths (title, description, slug, icon, color_theme)
VALUES (
    'Primaria Express', 
    'Termina tu primaria en tiempo récord con los conocimientos esenciales.', 
    'primaria-express', 
    '🎒', 
    'emerald'
) ON CONFLICT (slug) DO NOTHING;
