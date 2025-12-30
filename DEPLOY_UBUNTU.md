# Guia de Deploy no Ubuntu

Este guia explica como fazer o deploy da aplicação Love Vault Album em um servidor Ubuntu.

## Pré-requisitos

- Servidor Ubuntu (20.04 ou superior)
- Acesso SSH ao servidor
- Domínio configurado (opcional, mas recomendado)
- Credenciais do Supabase (URL e chave pública)

## Passo 1: Atualizar o Sistema

```bash
sudo apt update
sudo apt upgrade -y
```

## Passo 2: Instalar Node.js e npm

### Opção A: Usando NodeSource (Recomendado - versão mais recente)

```bash
# Instalar Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version
npm --version
```

### Opção B: Usando apt (versão do repositório Ubuntu)

```bash
sudo apt install -y nodejs npm
```

## Passo 3: Instalar Git

```bash
sudo apt install -y git
```

## Passo 4: Clonar o Repositório

```bash
# Criar diretório para aplicações
sudo mkdir -p /var/www
cd /var/www

# Clonar seu repositório (substitua pela URL do seu repositório)
sudo git clone https://github.com/seu-usuario/love-vault-album.git
sudo chown -R $USER:$USER /var/www/love-vault-album
cd love-vault-album
```

**Nota:** Se você não tem o código em um repositório Git, você pode fazer upload via SCP:

```bash
# No seu computador local (Windows)
scp -r C:\Users\paulo\Desktop\love-vault-album usuario@seu-servidor:/var/www/
```

## Passo 5: Instalar Dependências do Projeto

```bash
cd /var/www/love-vault-album
npm install
```

## Passo 6: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
nano .env
```

Adicione as seguintes variáveis (substitua pelos valores reais do seu Supabase):

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui
```

Salve o arquivo (Ctrl+O, Enter, Ctrl+X).

## Passo 7: Fazer Build da Aplicação

```bash
npm run build
```

Isso criará uma pasta `dist` com os arquivos estáticos prontos para produção.

## Passo 8: Instalar e Configurar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Criar configuração do site
sudo nano /etc/nginx/sites-available/love-vault-album
```

Adicione a seguinte configuração:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;  # Substitua pelo seu domínio

    root /var/www/love-vault-album/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Configuração para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Se você não tem domínio**, use o IP do servidor:

```nginx
server {
    listen 80;
    server_name _;  # Aceita qualquer domínio/IP

    root /var/www/love-vault-album/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Ativar o site:

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/love-vault-album /etc/nginx/sites-enabled/

# Remover configuração padrão (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## Passo 9: Configurar Firewall (UFW)

```bash
# Permitir HTTP
sudo ufw allow 'Nginx Full'
# ou apenas HTTP
sudo ufw allow 'Nginx HTTP'

# Habilitar firewall (se ainda não estiver)
sudo ufw enable
```

## Passo 10: Configurar SSL com Let's Encrypt (Opcional mas Recomendado)

Se você tem um domínio, configure HTTPS:

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática (já configurada automaticamente)
sudo certbot renew --dry-run
```

## Passo 11: Atualizar a Aplicação (Quando Fizer Mudanças)

Crie um script para facilitar atualizações:

```bash
nano /var/www/love-vault-album/deploy.sh
```

Adicione:

```bash
#!/bin/bash
cd /var/www/love-vault-album

# Atualizar código (se usar Git)
git pull origin main

# Instalar/atualizar dependências
npm install

# Fazer build
npm run build

# Reiniciar Nginx (se necessário)
sudo systemctl reload nginx

echo "Deploy concluído!"
```

Tornar o script executável:

```bash
chmod +x /var/www/love-vault-album/deploy.sh
```

## Passo 12: Verificar se Está Funcionando

Acesse no navegador:
- `http://seu-ip-do-servidor` (se não tem domínio)
- `http://seu-dominio.com` (se tem domínio)
- `https://seu-dominio.com` (se configurou SSL)

## Troubleshooting

### Verificar logs do Nginx

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Verificar status do Nginx

```bash
sudo systemctl status nginx
```

### Verificar se a porta 80 está aberta

```bash
sudo netstat -tlnp | grep :80
```

### Verificar permissões dos arquivos

```bash
# Garantir que Nginx pode ler os arquivos
sudo chown -R www-data:www-data /var/www/love-vault-album/dist
sudo chmod -R 755 /var/www/love-vault-album/dist
```

### Rebuildar a aplicação

```bash
cd /var/www/love-vault-album
rm -rf dist
npm run build
sudo systemctl reload nginx
```

## Alternativa: Usar PM2 para Servir a Aplicação

Se preferir usar o servidor de preview do Vite em vez de Nginx:

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar aplicação em modo produção
cd /var/www/love-vault-album
npm run build
pm2 serve dist 3000 --spa --name "love-vault-album"

# Salvar configuração do PM2
pm2 save
pm2 startup

# Configurar Nginx como reverse proxy
```

E ajustar a configuração do Nginx para fazer proxy:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Estrutura de Diretórios Recomendada

```
/var/www/
└── love-vault-album/
    ├── dist/              # Arquivos buildados (servidos pelo Nginx)
    ├── src/               # Código fonte
    ├── .env              # Variáveis de ambiente
    ├── package.json
    └── deploy.sh         # Script de deploy
```

## Próximos Passos

1. Configurar backup automático
2. Configurar monitoramento (opcional)
3. Configurar CI/CD (opcional)
4. Otimizar performance (cache, CDN, etc.)

## Suporte

Se encontrar problemas, verifique:
- Logs do Nginx: `/var/log/nginx/`
- Logs do sistema: `journalctl -xe`
- Status dos serviços: `systemctl status nginx`

