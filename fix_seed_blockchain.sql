-- Force Seed for Blockchain Verification
-- 1. Ensure User
INSERT INTO public.usuarios (id, email, password_hash, role, full_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'blockchain_tester@inea.mx', 'hash', 'student', 'Blockchain Tester')
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure Profile (FK often required)
INSERT INTO public.profiles (id, full_name, email, role, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'Blockchain Tester', 'blockchain_tester@inea.mx', 'student', NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Ensure Course
INSERT INTO public.clases_generadas (id, title, topic, created_at)
VALUES (999, 'Blockchain 101', 'Technology', NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Certificate
INSERT INTO public.certificates (
    id, student_id, course_id, course_name, final_grade, 
    issued_at, validation_code, 
    blockchain_tx_hash, chain_id, minted_at
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    999,
    'Blockchain 101',
    100,
    NOW(),
    'BLK-CHAIN-001',
    '0x71c0b34d93096009796001090339930190130913901390139013901039103931',
    137,
    NOW()
)
ON CONFLICT (id) DO UPDATE SET 
    blockchain_tx_hash = EXCLUDED.blockchain_tx_hash,
    chain_id = EXCLUDED.chain_id;
