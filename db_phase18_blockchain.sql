-- Phase 18: Blockchain Certificates
-- Goals: Store on-chain proof for certificates

-- 1. Add Blockchain Metadata to existing certificates table
ALTER TABLE public.certificates
ADD COLUMN IF NOT EXISTS blockchain_tx_hash TEXT, -- The Transaction Hash (0x...)
ADD COLUMN IF NOT EXISTS chain_id INTEGER DEFAULT 137, -- 137 = Polygon Mainnet, 80002 = Amoy
ADD COLUMN IF NOT EXISTS token_id TEXT, -- NFT Token ID if ERC721
ADD COLUMN IF NOT EXISTS minted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS smart_contract_address TEXT;

-- 2. Blockchain Verification Log (Audit Trail)
CREATE TABLE IF NOT EXISTS public.blockchain_verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id UUID REFERENCES public.certificates(id) ON DELETE CASCADE,
    verified_by_ip TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    verification_result BOOLEAN DEFAULT TRUE,
    notes TEXT
);

ALTER TABLE public.blockchain_verification_logs ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT verification logs (audit trail usage)
CREATE POLICY "Public Insert Verifications" ON public.blockchain_verification_logs
    FOR INSERT WITH CHECK (true);

-- Seed a "Minted" Certificate for Demo
-- We need a valid User ID. Let's assume we use one from existing users or create a dummy relation if needed.
-- For the SQL script independent execution, we'll try to update the LAST certificate or Insert one if none.

DO $$
DECLARE
    last_cert_id UUID;
    dummy_user_id UUID;
BEGIN
    SELECT id INTO dummy_user_id FROM public.usuarios LIMIT 1;
    
    IF dummy_user_id IS NOT NULL THEN
        -- Try to find existing cert
        SELECT id INTO last_cert_id FROM public.certificates WHERE student_id = dummy_user_id LIMIT 1;

        IF last_cert_id IS NOT NULL THEN
            -- Update existing
            UPDATE public.certificates
            SET blockchain_tx_hash = '0x71c0b34d93096009796001090339930190130913901390139013901039103931',
                chain_id = 80002, -- Polygon Amoy (Testnet)
                smart_contract_address = '0x1234567890123456789012345678901234567890',
                minted_at = NOW()
            WHERE id = last_cert_id;
        ELSE
            -- Insert new mocked blockchain cert
            INSERT INTO public.certificates (student_id, course_id, course_name, final_grade, blockchain_tx_hash, chain_id, minted_at)
            VALUES (dummy_user_id, 101, 'Desarrollo Blockchain Avanzado', 98, '0x71c0b34d93096009796001090339930190130913901390139013901039103931', 80002, NOW());
        END IF;
    END IF;
END $$;
