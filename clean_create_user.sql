-- Clean up
DELETE FROM public.profiles WHERE username = 'tester_manual';
DELETE FROM auth.users WHERE email = 'tester@inea.mx';

-- Insert User
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'tester@inea.mx',
  crypt('Password123!', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Tester Manual"}',
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
);

-- Insert Profile
INSERT INTO public.profiles (id, username, full_name, avatar_url)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'tester_manual',
  'Tester Manual',
  'https://ui-avatars.com/api/?name=TM'
);
