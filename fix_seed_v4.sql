DO $$
DECLARE
    u_id UUID := '00000000-0000-0000-0000-000000000001';
    c_id BIGINT := 999;
BEGIN
    -- 1. Auth User (Try minimal)
    BEGIN
        INSERT INTO auth.users (id, email)
        VALUES (u_id, 'demo_blockchain@inea.mx')
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Auth insert skipped: %', SQLERRM;
    END;

    -- 2. Profile (NO EMAIL column assumed)
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (u_id, 'Blockchain Demo User', 'student')
    ON CONFLICT (id) DO NOTHING;

    -- 3. Course
    INSERT INTO public.clases_generadas (id, title, topic)
    OVERRIDING SYSTEM VALUE
    VALUES (c_id, 'Blockchain Fundamentals', 'Technology')
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
