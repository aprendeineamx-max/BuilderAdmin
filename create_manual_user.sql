-- Crear usuario manualmente en Supabase
-- Email: feel-widow-curler@duck.com
-- Password: Afrodita!35

-- Primero, verificar si el usuario ya existe
SELECT id, email FROM auth.users WHERE email = 'feel-widow-curler@duck.com';

-- Si no existe, insertarlo (Supabase maneja el hashing automáticamente vía trigger)
-- NOTA: Esto debe ejecutarse vía Supabase Dashboard o API, no directamente en PostgreSQL
-- porque el password debe ser hasheado correctamente

-- Alternativa: Usar la API de Supabase Admin
-- POST https://tuproyecto.supabase.co/auth/v1/admin/users
-- Headers: apikey: tu_service_role_key
-- Body: {"email": "feel-widow-curler@duck.com", "password": "Afrodita!35", "email_confirm": true}
