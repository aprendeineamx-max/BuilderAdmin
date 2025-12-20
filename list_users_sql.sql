SELECT count(*) as total_users FROM auth.users;
SELECT email, aud, role, last_sign_in_at FROM auth.users ORDER BY created_at DESC LIMIT 10;
