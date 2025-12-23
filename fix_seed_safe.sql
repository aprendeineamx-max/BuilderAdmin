DO $$
DECLARE
    u_id UUID;
    c_id BIGINT;
    cert_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- 1. Ensure User (Try to find existing or create)
    SELECT id INTO u_id FROM public.usuarios LIMIT 1;
    IF u_id IS NULL THEN
        -- Create one if empty
        u_id := gen_random_uuid();
        INSERT INTO public.usuarios (id, email, password_hash, role, full_name, created_at)
        VALUES (u_id, 'demo@inea.mx', 'hash', 'student', 'Demo Student', NOW());
        
        -- Create Profile
        INSERT INTO public.profiles (id, full_name, email, role)
        VALUES (u_id, 'Demo Student', 'demo@inea.mx', 'student');
    END IF;

    -- 2. Ensure Course
    SELECT id INTO c_id FROM public.clases_generadas LIMIT 1;
    IF c_id IS NULL THEN
        -- Insert manual ID if none exists (safe for demo)
        c_id := 888;
        INSERT INTO public.clases_generadas (id, title, topic) 
        VALUES (c_id, 'Curso Demo', 'General');
    END IF;

    -- 3. Insert Cert
    INSERT INTO public.certificates (
        id, student_id, course_id, course_name, final_grade, 
        issued_at, validation_code, 
        blockchain_tx_hash, chain_id, minted_at
    )
    VALUES (
        cert_id, u_id, c_id, 'Curso de Validacion Blockchain', 100, 
        NOW(), 'BLOCK-VALID',
        '0xabc1234567890abcdef1234567890abcdef1234567890abcdef1234567890', 137, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET 
        blockchain_tx_hash = EXCLUDED.blockchain_tx_hash;
    
    RAISE NOTICE 'Seed Complete. Cert ID: %', cert_id;
END $$;
