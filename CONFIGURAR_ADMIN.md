# Configuração do Sistema de Autenticação Admin

Para proteger a área administrativa, você precisa criar um usuário administrador no Supabase.

## Passo 1: Criar Usuário Administrador

### ⚡ Opção Rápida: Script SQL Pronto

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Clique em **New query**
5. Abra o arquivo `criar_usuario_admin.sql` deste projeto
6. Copie e cole todo o conteúdo no SQL Editor
7. Clique em **Run** (ou pressione Ctrl+Enter)

O script criará automaticamente:
- **Email**: `paulo`
- **Senha**: `Century123!`
- **Status**: Email confirmado automaticamente

### Opção A: Via Dashboard do Supabase (Recomendado)

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Authentication** no menu lateral
4. Clique em **Users**
5. Clique em **Add user** > **Create new user**
6. Preencha:
   - **Email**: Seu email administrativo (ex: admin@casamento.com)
   - **Password**: Uma senha segura
   - **Auto Confirm User**: ✅ Marque esta opção (importante!)
7. Clique em **Create user**

### Opção B: Via SQL (Alternativa)

1. No Supabase Dashboard, vá em **SQL Editor**
2. Execute o seguinte SQL (substitua o email e senha):

```sql
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
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@casamento.com',  -- ⚠️ SUBSTITUA pelo seu email
  crypt('sua-senha-aqui', gen_salt('bf')),  -- ⚠️ SUBSTITUA pela sua senha
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Confirmar o email automaticamente
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'admin@casamento.com';  -- ⚠️ SUBSTITUA pelo seu email
```

**⚠️ IMPORTANTE:** Este método SQL é mais complexo. Recomendo usar a Opção A.

## Passo 2: Testar o Login

1. Acesse: `http://seu-site.com/admin/login`
2. Use o email e senha que você criou
3. Você deve ser redirecionado para `/admin/convidados`

## Passo 3: Configurar Políticas RLS (Opcional - Para Mais Segurança)

Se quiser que apenas usuários autenticados possam gerenciar convidados, você pode atualizar as políticas RLS:

```sql
-- Remover políticas públicas de INSERT, UPDATE e DELETE
DROP POLICY IF EXISTS "Anyone can insert guests" ON public.guests;
DROP POLICY IF EXISTS "Anyone can update guests" ON public.guests;
DROP POLICY IF EXISTS "Anyone can delete guests" ON public.guests;

-- Criar políticas apenas para usuários autenticados
CREATE POLICY "Authenticated users can insert guests" 
ON public.guests 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update guests" 
ON public.guests 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete guests" 
ON public.guests 
FOR DELETE 
TO authenticated
USING (true);
```

**Nota:** Isso tornará a área administrativa mais segura, mas os convidados ainda poderão fazer RSVP (SELECT e UPDATE do próprio registro).

## Troubleshooting

### Erro: "Invalid login credentials"
- Verifique se o email está correto
- Verifique se a senha está correta
- Certifique-se de que o usuário foi criado com "Auto Confirm User" marcado

### Erro: "Email not confirmed"
- No Supabase Dashboard, vá em Authentication > Users
- Encontre seu usuário
- Clique nos três pontos > "Confirm email"

### Não consigo acessar /admin/convidados
- Certifique-se de estar logado
- Verifique se o redirecionamento está funcionando
- Limpe o cache do navegador

## Segurança

- Use uma senha forte (mínimo 8 caracteres, com letras, números e símbolos)
- Não compartilhe suas credenciais
- Considere usar autenticação de dois fatores (2FA) se disponível no Supabase

