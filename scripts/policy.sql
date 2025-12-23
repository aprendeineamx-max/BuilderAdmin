ALTER TABLE public.clases_generadas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read" ON public.clases_generadas;
CREATE POLICY "Public Read" ON public.clases_generadas FOR SELECT USING (true);
