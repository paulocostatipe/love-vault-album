#!/bin/bash

# Script de Deploy Simples para Ubuntu
# Love Vault Album

set -e  # Parar em caso de erro

echo "🚀 Deploy Simples - Love Vault Album"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado. Execute este script na raiz do projeto.${NC}"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado.${NC}"
    echo "Instale com:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt install -y nodejs"
    exit 1
fi

echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✓ npm: $(npm --version)${NC}"
echo ""

# Verificar se .env existe (apenas aviso, não bloqueia)
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado.${NC}"
    echo "Crie um arquivo .env com:"
    echo "  VITE_SUPABASE_URL=..."
    echo "  VITE_SUPABASE_PUBLISHABLE_KEY=..."
    echo ""
    read -p "Continuar mesmo assim? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build
echo ""
echo "🔨 Fazendo build..."
npm run build

# Verificar build
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erro: Build falhou!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build concluído!${NC}"
echo ""

# Verificar PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 não está instalado.${NC}"
    echo "Instalando PM2..."
    sudo npm install -g pm2
fi

# Iniciar/Reiniciar com PM2
echo ""
echo "🚀 Iniciando aplicação com PM2..."
pm2 delete love-vault-album 2>/dev/null || true
pm2 serve dist 3000 --spa --name "love-vault-album"
pm2 save

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo "🌐 Acesse: http://seu-ip:3000"
echo ""
echo "📝 Comandos úteis:"
echo "  pm2 list                    # Ver status"
echo "  pm2 restart love-vault-album # Reiniciar"
echo "  pm2 logs love-vault-album     # Ver logs"
echo ""

