-- Crear usuario directamente en auth.users con password hasheado
-- Email: feel-widow-curler@duck.com
-- Password: Afrodita!35

-- Nota: El password debe estar hasheado con bcrypt
-- Para este demo, usaremos el sistema de Supabase correctamente

-- Primero verificar si existe
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'feel-widow-curler@duck.com';

-- Si no existe, insertarlo (con hash bcrypt de "Afrodita!35")
-- Hash generado: $2a$10$Vx.abcdefghijklmnopqrstu (ejemplo, debe generarse realmente)

-- En Supabase, la forma correcta es usar la función sign_up vía HTTP API
-- pero como workaround, insertamos directamente:

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_sent_at,
    recovery_token,
    email_change_sent_at,
    email_change_token_current,
    email_change_token_new,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'feel-widow-curler@duck.com',
    crypt('Afrodita!35', gen_salt('bf')), -- Bcrypt hash
    NOW(), -- Auto-confirmar email
    NOW(),
    '',
    NOW(),
    '',
    NOW(),
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Hola Mundo","nivel":"secundaria"}',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id, email, email_confirmed_at;
