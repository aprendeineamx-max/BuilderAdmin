-- Enable RLS
ALTER TABLE IF EXISTS public.certificates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflict
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can insert own certificates" ON public.certificates;

-- Create Policies
CREATE POLICY "Users can view own certificates" 
ON public.certificates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates" 
ON public.certificates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Verify table existence
select count(*) from public.certificates;
