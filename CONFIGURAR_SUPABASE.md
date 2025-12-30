# Configuração do Supabase para Galeria de Fotos

Para que o upload e a exibição de fotos funcionem, você precisa configurar o Supabase Storage.

## Passo 1: Criar o Bucket de Storage

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Storage** no menu lateral
4. Clique em **New bucket**
5. Configure:
   - **Name**: `gallery`
   - **Public bucket**: ✅ Marque como público (para que as fotos sejam acessíveis)
6. Clique em **Create bucket**

## Passo 2: Configurar Políticas do Bucket

1. No bucket `gallery`, vá em **Policies**
2. Clique em **New Policy**
3. Selecione **For full customization**
4. Adicione as seguintes políticas:

### Política 1: Permitir leitura pública
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');
```

### Política 2: Permitir upload público
```sql
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery');
```

### Política 3: Permitir deleção pública (opcional)
```sql
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery');
```

## Passo 3: Executar Migration da Tabela

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **New query**
3. Cole o conteúdo do arquivo `supabase/migrations/20250101000000_create_gallery_table.sql`
4. Clique em **Run** para executar

Ou execute via CLI do Supabase:

```bash
supabase db push
```

## Passo 4: Verificar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` contém:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

**⚠️ IMPORTANTE:** 
- Use `VITE_` como prefixo (não `NEXT_PUBLIC_`), pois este projeto usa Vite
- O nome correto é `VITE_SUPABASE_PUBLISHABLE_KEY` (não `PUBLISHABLE_DEFAULT_KEY`)

## Teste

1. Acesse a página `/upload`
2. Faça upload de uma foto
3. Verifique se aparece na galeria (`/galeria`)

## Troubleshooting

### Erro: "Bucket not found"
- Verifique se o bucket `gallery` foi criado
- Verifique se o nome está exatamente como `gallery` (minúsculas)

### Erro: "new row violates row-level security policy"
- Execute a migration da tabela `gallery_media`
- Verifique se as políticas RLS estão configuradas corretamente

### Fotos não aparecem
- Verifique se o bucket é público
- Verifique se as políticas de storage estão configuradas
- Verifique os logs do navegador (F12 > Console)

### Erro ao fazer upload
- Verifique o tamanho do arquivo (máximo 10MB)
- Verifique o tipo do arquivo (apenas imagens e vídeos)
- Verifique se as variáveis de ambiente estão configuradas

