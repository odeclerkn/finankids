#!/bin/sh
# ===================================
# FinanKids - Docker Entrypoint
# ===================================

set -e

echo ""
echo "🐷 FinanKids - Iniciando..."
echo "=================================="

# ===================================
# Verificar variables de entorno
# ===================================

echo ""
echo "📋 Verificando configuración..."

if [ -z "$NEXT_PUBLIC_CONVEX_URL" ]; then
  echo ""
  echo "⚠️  NEXT_PUBLIC_CONVEX_URL no está configurada"
  echo ""
  echo "Para obtenerla:"
  echo "  1. Ve a https://dashboard.convex.dev"
  echo "  2. Crea un proyecto nuevo (o selecciona uno existente)"
  echo "  3. Copia la URL (ej: https://xxx-123.convex.cloud)"
  echo "  4. Agrégala a tu .env.local"
  echo ""
  echo "⚠️  La app iniciará pero sin base de datos."
  echo ""
else
  echo "✅ Convex URL configurada"
fi

if [ -z "$OPENROUTER_API_KEY" ]; then
  echo ""
  echo "⚠️  OPENROUTER_API_KEY no está configurada"
  echo ""
  echo "Para obtenerla:"
  echo "  1. Ve a https://openrouter.ai/keys"
  echo "  2. Crea una API key"
  echo "  3. Agrégala a tu .env.local"
  echo ""
  echo "⚠️  La IA no funcionará sin esta key."
  echo ""
else
  echo "✅ OpenRouter API Key configurada"
fi

# ===================================
# Auto-seed RAG (si está configurado)
# ===================================

if [ "$AUTO_SEED_RAG" = "true" ] && [ -n "$NEXT_PUBLIC_CONVEX_URL" ]; then
  echo ""
  echo "📚 Auto-seed de RAG habilitado"
  echo "   Se ejecutará después de que la app inicie..."
  
  # Ejecutar seed en background después de que la app inicie
  (
    sleep 20
    echo ""
    echo "🌱 Verificando base de conocimiento..."
    
    STATS=$(curl -s "http://localhost:3000/api/rag/admin?view=stats" 2>/dev/null || echo '{"stats":{"total":0}}')
    
    if echo "$STATS" | grep -q '"total":0'; then
      echo "🌱 Sembrando datos de conocimiento..."
      RESULT=$(curl -s -X POST "http://localhost:3000/api/rag/admin" \
        -H "Content-Type: application/json" \
        -d '{"action": "seed-and-embed"}' 2>/dev/null || echo '{"error":"failed"}')
      
      if echo "$RESULT" | grep -q '"success":true'; then
        echo "✅ Base de conocimiento inicializada correctamente"
      else
        echo "⚠️  Error al sembrar: $RESULT"
        echo "   Puedes ejecutar manualmente: make rag-full"
      fi
    else
      echo "✅ Base de conocimiento ya tiene datos"
    fi
  ) &
fi

# ===================================
# Iniciar la aplicación
# ===================================

echo ""
echo "🚀 Iniciando Next.js..."
echo "=================================="
echo ""
echo "📱 App: http://localhost:3000"
echo "📱 Chat: http://localhost:3000/kid/chat"
echo "📱 Dashboard: http://localhost:3000/kid/dashboard"
echo ""

# Ejecutar el comando pasado (npm run dev)
exec "$@"
