-- Criar usuário administrador
-- Email: paulo@casamento.com
-- Senha: Century123!

-- Método 1: Usando a função do Supabase (Recomendado)
-- Nota: Esta função pode não estar disponível em todos os projetos
-- Se der erro, use o Método 2 abaixo

DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Criar usuário usando a função auth.uid()
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
    is_super_admin,
    last_sign_in_at
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
    false,
    now()
  )
  RETURNING id INTO user_id;

  -- Criar entrada na tabela auth.identities
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
  VALUES (
    gen_random_uuid(),
    user_id,
    user_id::text,  -- provider_id é o mesmo que o user_id como string
    format('{"sub":"%s","email":"%s"}', user_id::text, 'paulo@casamento.com')::jsonb,
    'email',
    now(),
    now(),
    now()
  );

  RAISE NOTICE 'Usuário criado com sucesso! ID: %', user_id;
END $$;

-- Se o método acima não funcionar, use este método alternativo:
-- (Descomente e execute apenas se o primeiro método falhar)

/*
-- Método 2: Criar usuário diretamente
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
  'paulo',
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
ON CONFLICT (email) DO NOTHING;
*/

-- Verificar se o usuário foi criado
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'paulo@casamento.com';

