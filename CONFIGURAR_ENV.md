# Configuração das Variáveis de Ambiente

## ⚠️ IMPORTANTE: Prefixo Correto

Este projeto usa **Vite**, não Next.js. Portanto, as variáveis devem usar o prefixo `VITE_`, não `NEXT_PUBLIC_`.

## Criar arquivo .env

1. Copie o arquivo de exemplo:
   ```bash
   cp env.example .env
   ```

2. Edite o arquivo `.env` e adicione suas credenciais:

```env
VITE_SUPABASE_URL=https://tnofsusjbhrrnbpjgnxb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_qb2aEWT-xL8SytyxNoBiNw_kBLM-apF
```

## Valores Corretos

Com base nas suas credenciais:

- **URL**: `https://tnofsusjbhrrnbpjgnxb.supabase.co`
- **Chave**: `sb_publishable_qb2aEWT-xL8SytyxNoBiNw_kBLM-apF`

## Verificar se está funcionando

Após criar o `.env`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

Se houver erros, verifique:
- ✅ O arquivo se chama `.env` (não `.env.local` ou outro)
- ✅ Está na raiz do projeto
- ✅ Usa `VITE_` como prefixo
- ✅ Não tem espaços antes ou depois do `=`

## No Servidor (Ubuntu)

No servidor, também crie o arquivo `.env` com as mesmas variáveis:

```bash
cd /home/paulo/love-vault-album
nano .env
```

Cole as mesmas variáveis e salve (Ctrl+O, Enter, Ctrl+X).

