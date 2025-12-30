# Deploy Simples no Ubuntu

Guia rápido e direto para fazer deploy da aplicação.

## Passo 1: Instalar Node.js (Versão 18 ou Superior)

**⚠️ IMPORTANTE:** O Vite requer Node.js 18 ou superior!

```bash
# Verificar versão atual (se já tiver Node.js)
node --version

# Remover versão antiga (se necessário)
sudo apt remove nodejs npm -y
sudo apt autoremove -y

# Instalar Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version  # Deve mostrar v20.x.x ou superior
npm --version
```

**Se o comando curl não funcionar, use:**

```bash
# Alternativa: Usar NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

## Passo 2: Copiar o Projeto para o Servidor

```bash
# Criar pasta
sudo mkdir -p /var/www/love-vault-album
cd /var/www/love-vault-album

# Se você tem Git:
sudo git clone seu-repositorio .

# OU se você vai copiar via SCP do Windows:
# No Windows: scp -r C:\Users\paulo\Desktop\love-vault-album usuario@servidor:/var/www/
```

## Passo 3: Configurar Variáveis de Ambiente

```bash
cd /var/www/love-vault-album
nano .env
```

Adicione:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

## Passo 4: Instalar e Build

```bash
npm install
npm run build
```

## Passo 5: Instalar PM2 (Gerenciador de Processos)

```bash
sudo npm install -g pm2
```

## Passo 6: Iniciar a Aplicação

```bash
# Servir a pasta dist na porta 3000
pm2 serve dist 3000 --spa --name "love-vault-album"

# Salvar configuração para iniciar automaticamente
pm2 save
pm2 startup
```

## Passo 7: Abrir Porta no Firewall

```bash
sudo ufw allow 3000
```

## Pronto! 🎉

Acesse: `http://seu-ip-do-servidor:3000`

## Comandos Úteis do PM2

```bash
pm2 list              # Ver aplicações rodando
pm2 restart love-vault-album  # Reiniciar
pm2 stop love-vault-album     # Parar
pm2 logs love-vault-album      # Ver logs
pm2 delete love-vault-album    # Remover
```

## Atualizar a Aplicação (Quando Fizer Mudanças)

```bash
cd /var/www/love-vault-album
git pull          # Se usar Git
npm install       # Se houver novas dependências
npm run build     # Rebuild
pm2 restart love-vault-album
```

## Usar Domínio (Opcional)

Se quiser usar um domínio em vez de IP:3000, instale Nginx:

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/love-vault-album
```

Cole:
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
    }
}
```

Ative:
```bash
sudo ln -s /etc/nginx/sites-available/love-vault-album /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'
```

## Troubleshooting

### Erro: "SyntaxError: Unexpected reserved word" ou "await is not defined"

**Causa:** Versão do Node.js muito antiga (precisa ser 18+)

**Solução:**
```bash
# Verificar versão
node --version

# Se for menor que v18, atualize:
sudo apt remove nodejs npm -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar novamente
node --version
```

### Erro: "Cannot find module" após npm install

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Permission denied" ao instalar pacotes globais

**Solução:**
```bash
# Configurar npm para não usar sudo
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Ou usar sudo (mais simples)
sudo npm install -g pm2
```

