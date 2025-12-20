-- Phase 17: Blog System
-- Table: posts

CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL, -- Markdown content
    excerpt TEXT,
    cover_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read published posts
CREATE POLICY "Public can read published posts"
    ON public.posts
    FOR SELECT
    USING (published = true);

-- Policy: Authenticated users (Admins) can do everything
-- Ideally this should be restricted to admin role, but for now authenticated is fine
CREATE POLICY "Auth users can manage posts"
    ON public.posts
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts (slug);
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON public.posts (published_at);

-- Trigger for updated_at
CREATE TRIGGER update_posts_modtime
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Seed Data (Example Post)
INSERT INTO public.posts (title, slug, content, excerpt, published, published_at, tags)
VALUES (
    'Bienvenido al Blog de INEA.mx',
    'bienvenido-blog-inea',
    '# Hola Mundo\n\nEste es el primer post del blog de **INEA.mx**. Aquí compartiremos consejos de estudio, noticias importantes y guías para aprobar tus exámenes.\n\n## ¿Qué encontrarás aquí?\n- Guías de estudio\n- Tips para exámenes\n- Novedades de la plataforma\n\n¡Sigue aprendiendo!',
    'Primer artículo de bienvenida al blog oficial de INEA.mx con consejos y novedades.',
    true,
    NOW(),
    ARRAY['bienvenida', 'noticias', 'estudio']
) ON CONFLICT (slug) DO NOTHING;
