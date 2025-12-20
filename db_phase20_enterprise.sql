-- Phase 20: Enterprise & B2B
-- Organizations and Team Management

-- 1. Organizations (Empresas/Escuelas)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    website TEXT,
    plan TEXT DEFAULT 'free', -- 'starter', 'growth', 'enterprise'
    license_limit INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Organization Members
CREATE TABLE IF NOT EXISTS public.organization_members (
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (organization_id, user_id)
);

-- 3. Invites
CREATE TABLE IF NOT EXISTS public.organization_invites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMP WITH TIME ZONE
);

-- RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public can see basic org info if they know the slug (for landing pages)
CREATE POLICY "Public read organizations" ON public.organizations 
    FOR SELECT USING (true);

-- Members can see their own org members
CREATE POLICY "Members view colleagues" ON public.organization_members
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
        )
    );

-- Admins can manage members
CREATE POLICY "Admins manage members" ON public.organization_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE user_id = auth.uid() 
            AND organization_id = organization_members.organization_id 
            AND role IN ('owner', 'admin')
        )
    );

-- Seed Data (Demo Company)
INSERT INTO public.organizations (name, slug, plan, license_limit)
VALUES ('Tech Corp Mexico', 'tech-corp', 'enterprise', 100)
ON CONFLICT (slug) DO NOTHING;
