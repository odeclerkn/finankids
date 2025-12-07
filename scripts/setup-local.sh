#!/bin/bash
# ===================================
# FinanKids - Setup Local
# ===================================
# Ejecuta este script para configurar el proyecto localmente
# Uso: ./scripts/setup-local.sh
# ===================================

set -e

echo "🐷 FinanKids - Setup Local"
echo "=================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ===================================
# 1. Crear .env.local si no existe
# ===================================

if [ ! -f ".env.local" ]; then
  echo "${BLUE}📝 Creando .env.local...${NC}"
  
  cat > .env.local << 'EOF'
# ===================================
# FinanKids - Variables de Entorno
# ===================================

# Convex (base de datos)
# Obtén esta URL ejecutando: npx convex dev
NEXT_PUBLIC_CONVEX_URL=

# OpenRouter (IA)
# Obtén tu key en: https://openrouter.ai/keys
OPENROUTER_API_KEY=

# Opcional: Deploy key para auto-deploy de Convex
# Obtén en: https://dashboard.convex.dev -> Settings -> Deploy Keys
# CONVEX_DEPLOY_KEY=

# Opcional: Auto-sembrar RAG al iniciar
AUTO_SEED_RAG=true
EOF

  echo "${GREEN}✅ .env.local creado${NC}"
  echo ""
  echo "${YELLOW}⚠️  IMPORTANTE: Edita .env.local y agrega tus API keys${NC}"
  echo ""
else
  echo "${GREEN}✅ .env.local ya existe${NC}"
fi

# ===================================
# 2. Instalar dependencias
# ===================================

echo ""
echo "${BLUE}📦 Instalando dependencias...${NC}"
npm install

# ===================================
# 3. Instrucciones
# ===================================

echo ""
echo "${GREEN}=================================="
echo "✅ Setup completado!"
echo "==================================${NC}"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "  ${BLUE}1.${NC} Edita ${YELLOW}.env.local${NC} y agrega:"
echo "     - OPENROUTER_API_KEY (de https://openrouter.ai/keys)"
echo ""
echo "  ${BLUE}2.${NC} Configura Convex:"
echo "     ${YELLOW}npx convex dev${NC}"
echo "     (Esto actualizará NEXT_PUBLIC_CONVEX_URL automáticamente)"
echo ""
echo "  ${BLUE}3.${NC} Configura la API key en Convex:"
echo "     ${YELLOW}npx convex env set OPENROUTER_API_KEY <tu-key>${NC}"
echo ""
echo "  ${BLUE}4.${NC} Inicia la aplicación:"
echo ""
echo "     ${GREEN}Con Docker:${NC}"
echo "     ${YELLOW}docker-compose up${NC}"
echo ""
echo "     ${GREEN}Sin Docker:${NC}"
echo "     Terminal 1: ${YELLOW}npx convex dev${NC}"
echo "     Terminal 2: ${YELLOW}npm run dev${NC}"
echo ""
echo "  ${BLUE}5.${NC} Abre ${BLUE}http://localhost:3000${NC}"
echo ""

