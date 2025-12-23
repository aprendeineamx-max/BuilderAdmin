DO $$
DECLARE
    u_id UUID := '00000000-0000-0000-0000-000000000001';
    c_id BIGINT := 999;
BEGIN
    -- 1. Insert into auth.users (Mock Auth for FK satisfaction)
    -- We use ON CONFLICT DO NOTHING to differentiate from real users
    BEGIN
        INSERT INTO auth.users (id, instance_id, email, aud, role, email_confirmed_at, raw_user_meta_data)
        VALUES (
            u_id, 
            '00000000-0000-0000-0000-000000000000', 
            'demo_blockchain@inea.mx', 
            'authenticated', 
            'authenticated', 
            NOW(), 
            '{"full_name": "Blockchain Demo User"}'
        )
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Skipping auth.users insert: %', SQLERRM;
    END;

    -- 2. Insert into public.profiles
    INSERT INTO public.profiles (id, full_name, email, role, created_at)
    VALUES (u_id, 'Blockchain Demo User', 'demo_blockchain@inea.mx', 'student', NOW())
    ON CONFLICT (id) DO NOTHING;

    -- 3. Insert Course (clases_generadas)
    -- Using OVERRIDING SYSTEM VALUE if identity column
    INSERT INTO public.clases_generadas (id, title, topic, created_at)
    OVERRIDING SYSTEM VALUE
    VALUES (c_id, 'Blockchain Fundamentals', 'Technology', NOW())
    ON CONFLICT (id) DO NOTHING;

    -- 4. Certificate
    INSERT INTO public.certificates (
        id, student_id, course_id, course_name, final_grade, 
        issued_at, validation_code, 
        blockchain_tx_hash, chain_id, minted_at
    )
    VALUES (
        '11111111-1111-1111-1111-111111111111',
        u_id,
        c_id,
        'Blockchain Fundamentals',
        100,
        NOW(),
        'BLK-VERIFIED-01',
        '0x72c0b34d93096009796001090339930190130913901390139013901039103931',
        137,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET 
        blockchain_tx_hash = EXCLUDED.blockchain_tx_hash,
        chain_id = EXCLUDED.chain_id;

END $$;
