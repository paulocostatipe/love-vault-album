-- Script SQL para criar usuário administrador
-- Execute este script no SQL Editor do Supabase
-- Email: paulo@casamento.com
-- Senha: Century123!

-- IMPORTANTE: Execute este script no SQL Editor do Supabase Dashboard

-- Criar usuário administrador
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'paulo@casamento.com',
  crypt('Century123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  '{"provider":"email","providers":["email"]}',
  '{}',
  false
)
ON CONFLICT DO NOTHING;

-- Criar identidade do usuário
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', 'paulo@casamento.com'),
  'email',
  now(),
  now(),
  now()
FROM auth.users u
WHERE u.email = 'paulo@casamento.com'
ON CONFLICT DO NOTHING;

-- Verificar se o usuário foi criado
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'Confirmado'
    ELSE 'Não confirmado'
  END as status
FROM auth.users
WHERE email = 'paulo@casamento.com';

