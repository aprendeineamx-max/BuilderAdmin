-- Phase 17: Professional Assessments Engine

-- 1. Exams (The container)
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    course_id BIGINT REFERENCES public.clases_generadas(id), -- Optional link to course
    time_limit_minutes INTEGER DEFAULT 60,
    passing_score INTEGER DEFAULT 70, -- Percentage
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Questions
-- Types: 'multiple_choice', 'boolean', 'drag_drop', 'pairing'
CREATE TABLE IF NOT EXISTS public.exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL, 
    media_url TEXT, -- Optional image/audio for question
    points INTEGER DEFAULT 10,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Options / Answers (Flexible structure for various types)
CREATE TABLE IF NOT EXISTS public.exam_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.exam_questions(id) ON DELETE CASCADE,
    label TEXT NOT NULL, -- "Blue", "True", "Dog"
    value TEXT, -- The value to match (for pairing) or just same as label
    is_correct BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0
);

-- 4. User Attempts
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score_obtained INTEGER, -- Final score
    passed BOOLEAN DEFAULT FALSE,
    answers_log JSONB DEFAULT '{}' -- Store full answer metadata for review
);

-- RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Public Read Questions" ON public.exam_questions FOR SELECT USING (true);
CREATE POLICY "Public Read Options" ON public.exam_options FOR SELECT USING (true);

-- Attempts: Users see their own
CREATE POLICY "Read Own Attempts" ON public.exam_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert Own Attempts" ON public.exam_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update Own Attempts" ON public.exam_attempts FOR UPDATE USING (auth.uid() = user_id);

-- SEED DATA (Demo Exam)
INSERT INTO public.exams (title, description, time_limit_minutes, passing_score)
VALUES ('Certificación Primaria - Matemáticas', 'Examen final de matemáticas básicas. Cubre aritmética y geometría.', 45, 80);

-- Get ID of inserted exam (Mocking static ID for demo seed simplicity in next steps usually requires DO block or separate inserts, 
-- but we will insert questions assuming we pick the latest exam or specific ID if we knew it.
-- For simplicity, let's just create a function or rely on the UI fetching the 'latest' exam.)

-- Function to seed questions if exam exists (Safe re-run)
DO $$
DECLARE
    exam_uuid UUID;
    q_uuid UUID;
BEGIN
    SELECT id INTO exam_uuid FROM public.exams WHERE title = 'Certificación Primaria - Matemáticas' LIMIT 1;
    
    IF exam_uuid IS NOT NULL THEN
        -- Q1: Multiple Choice
        INSERT INTO public.exam_questions (exam_id, question_text, question_type, points, order_index)
        VALUES (exam_uuid, '¿Cuánto es 8 x 7?', 'multiple_choice', 20, 1) RETURNING id INTO q_uuid;
        
        INSERT INTO public.exam_options (question_id, label, is_correct) VALUES 
        (q_uuid, '54', false), (q_uuid, '56', true), (q_uuid, '64', false);

        -- Q2: Boolean
        INSERT INTO public.exam_questions (exam_id, question_text, question_type, points, order_index)
        VALUES (exam_uuid, 'Un triángulo equilátero tiene todos sus lados iguales.', 'boolean', 20, 2) RETURNING id INTO q_uuid;
        
        INSERT INTO public.exam_options (question_id, label, is_correct) VALUES 
        (q_uuid, 'Verdadero', true), (q_uuid, 'Falso', false);

        -- Q3: Drag and Drop (Pairing) - We will store pairs as correct options
        -- Frontend will serialize dragging 'Concept' to 'Definition'.
        -- Here we define correct pairs.
        INSERT INTO public.exam_questions (exam_id, question_text, question_type, points, order_index)
        VALUES (exam_uuid, 'Relaciona las figuras con sus lados.', 'pairing', 30, 3) RETURNING id INTO q_uuid;
        
        INSERT INTO public.exam_options (question_id, label, value, is_correct) VALUES 
        (q_uuid, 'Triángulo', '3 lados', true),
        (q_uuid, 'Cuadrado', '4 lados', true),
        (q_uuid, 'Pentágono', '5 lados', true);
    END IF;
END $$;
