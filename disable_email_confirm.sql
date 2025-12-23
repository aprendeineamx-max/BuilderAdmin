-- Deshabilitar confirmación de email en Supabase
-- Esto permite registro instantáneo sin depender de endpoints de email

-- Actualizar la configuración de auth en la tabla auth.config
UPDATE auth.config 
SET 
    enable_signup = true,
    email_confirmation = false
WHERE true;

-- Si la tabla auth.config no existe, configurar via environment variables
-- En docker-compose.yml o .env de Supabase:
-- GOTRUE_MAILER_AUTOCONFIRM=true
-- GOTRUE_EMAIL_ENABLE_SIGNUP=true

-- Verificar configuración actual
SELECT * FROM auth.config;
