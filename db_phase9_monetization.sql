-- Phase 9: Monetization Schema

-- Plans Catalog
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY, -- 'free', 'pro_monthly', 'pro_yearly', 'enterprise'
    name TEXT NOT NULL,
    price numeric NOT NULL,
    currency TEXT DEFAULT 'MXN',
    features JSONB NOT NULL,
    active BOOLEAN DEFAULT true
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    plan_id TEXT REFERENCES public.plans(id) NOT NULL,
    status TEXT NOT NULL, -- 'active', 'canceled', 'past_due'
    provider TEXT NOT NULL, -- 'stripe', 'mercadopago', 'mock'
    provider_subscription_id TEXT, -- External ID
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment History
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    amount numeric NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL, -- 'succeeded', 'failed'
    provider TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Plans are public
CREATE POLICY "Public plans read" ON public.plans FOR SELECT USING (true);

-- Users see their own subs and payments
CREATE POLICY "Users view own subs" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- Seed Plans
INSERT INTO public.plans (id, name, price, features) VALUES
('free', 'Plan Gratuito', 0, '["Acceso a cursos básicos", "Publicidad limitada", "Certificados con marca de agua"]'),
('pro_monthly', 'Plan Pro (Mensual)', 199, '["Acceso ilimitado", "Sin publicidad", "Tutor IA ilimitado", "Certificados oficiales", "Descarga offline"]'),
('pro_yearly', 'Plan Pro (Anual)', 1990, '["Ahorra 2 meses", "Todo lo de Pro", "Mentoría mensual", "Merch exclusivo"]'),
('enterprise', 'Plan Empresarial', 0, '["Panel administrativo", "Licencias por volumen", "Reportes de progreso", "Soporte dedicado"]')
ON CONFLICT (id) DO NOTHING;
