# ===================================
# FinanKids - Makefile
# ===================================
# Comandos simplificados para gestionar el proyecto
#
# Uso: make <comando>
# ===================================

.PHONY: help install dev build start docker-up docker-down docker-build clean setup convex-dev convex-deploy rag-seed rag-embed rag-full rag-stats rag-clear rag-test setup-local

# Colores para output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RESET := \033[0m

# Comando por defecto
help:
	@echo ""
	@echo "$(CYAN)🐷 FinanKids - Comandos Disponibles$(RESET)"
	@echo ""
	@echo "$(GREEN)Configuración:$(RESET)"
	@echo "  make install      - Instala dependencias"
	@echo "  make setup        - Ejecuta el asistente de configuración"
	@echo ""
	@echo "$(GREEN)Desarrollo (sin Docker):$(RESET)"
	@echo "  make dev          - Inicia servidor de desarrollo"
	@echo "  make build        - Compila para producción"
	@echo "  make start        - Inicia servidor de producción"
	@echo ""
	@echo "$(GREEN)Docker:$(RESET)"
	@echo "  make docker-up    - Inicia con Docker (desarrollo)"
	@echo "  make docker-down  - Detiene contenedores"
	@echo "  make docker-build - Reconstruye imagen Docker"
	@echo "  make docker-prod  - Inicia en modo producción"
	@echo "  make docker-logs  - Ver logs del contenedor"
	@echo ""
	@echo "$(GREEN)Convex:$(RESET)"
	@echo "  make convex-dev   - Inicia Convex en modo desarrollo"
	@echo "  make convex-deploy- Despliega a Convex producción"
	@echo ""
	@echo "$(GREEN)RAG (Base de Conocimiento):$(RESET)"
	@echo "  make rag-full     - Sembrar datos Y generar embeddings"
	@echo "  make rag-seed     - Solo sembrar datos (sin embeddings)"
	@echo "  make rag-embed    - Solo generar embeddings"
	@echo "  make rag-stats    - Ver estadísticas"
	@echo "  make rag-test     - Probar búsqueda"
	@echo "  make rag-clear    - Limpiar base de conocimiento"
	@echo ""
	@echo "$(GREEN)Utilidades:$(RESET)"
	@echo "  make setup-local  - Configurar proyecto localmente"
	@echo "  make clean        - Limpia archivos generados"
	@echo "  make lint         - Ejecuta linter"
	@echo ""

# ===================================
# Configuración
# ===================================

install:
	@echo "$(CYAN)📦 Instalando dependencias...$(RESET)"
	npm install

setup:
	@echo "$(CYAN)⚙️  Ejecutando asistente de configuración...$(RESET)"
	node scripts/setup.js

# ===================================
# Desarrollo (sin Docker)
# ===================================

dev:
	@echo "$(CYAN)🚀 Iniciando servidor de desarrollo...$(RESET)"
	npm run dev

build:
	@echo "$(CYAN)🔨 Compilando para producción...$(RESET)"
	npm run build

start:
	@echo "$(CYAN)▶️  Iniciando servidor de producción...$(RESET)"
	npm run start

lint:
	@echo "$(CYAN)🔍 Ejecutando linter...$(RESET)"
	npm run lint

# ===================================
# Docker
# ===================================

docker-up:
	@echo "$(CYAN)🐳 Iniciando con Docker (desarrollo)...$(RESET)"
	docker-compose up

docker-down:
	@echo "$(CYAN)🛑 Deteniendo contenedores...$(RESET)"
	docker-compose down

docker-build:
	@echo "$(CYAN)🔨 Reconstruyendo imagen Docker...$(RESET)"
	docker-compose build --no-cache

docker-prod:
	@echo "$(CYAN)🚀 Iniciando en modo producción...$(RESET)"
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

docker-logs:
	@echo "$(CYAN)📋 Mostrando logs...$(RESET)"
	docker-compose logs -f app

# ===================================
# Convex
# ===================================

convex-dev:
	@echo "$(CYAN)⚡ Iniciando Convex en desarrollo...$(RESET)"
	npx convex dev

convex-deploy:
	@echo "$(CYAN)🚀 Desplegando a Convex producción...$(RESET)"
	npx convex deploy

# ===================================
# RAG (Base de Conocimiento)
# ===================================

rag-seed:
	@echo "$(CYAN)🌱 Sembrando base de conocimiento...$(RESET)"
	curl -X POST http://localhost:3000/api/rag/admin -H "Content-Type: application/json" -d '{"action": "seed"}'

rag-embed:
	@echo "$(CYAN)🧠 Generando embeddings...$(RESET)"
	curl -X POST http://localhost:3000/api/rag/admin -H "Content-Type: application/json" -d '{"action": "generate-embeddings"}'

rag-full:
	@echo "$(CYAN)🚀 Sembrando y generando embeddings...$(RESET)"
	curl -X POST http://localhost:3000/api/rag/admin -H "Content-Type: application/json" -d '{"action": "seed-and-embed"}'

rag-stats:
	@echo "$(CYAN)📊 Estadísticas de RAG...$(RESET)"
	curl http://localhost:3000/api/rag/admin?view=stats

rag-clear:
	@echo "$(YELLOW)⚠️  Limpiando base de conocimiento...$(RESET)"
	curl -X POST http://localhost:3000/api/rag/admin -H "Content-Type: application/json" -d '{"action": "clear"}'

rag-test:
	@echo "$(CYAN)🔍 Probando búsqueda RAG...$(RESET)"
	curl -X POST http://localhost:3000/api/rag/search -H "Content-Type: application/json" -d '{"query": "¿Qué es el ahorro?", "age": 9}'

# ===================================
# Utilidades
# ===================================

clean:
	@echo "$(CYAN)🧹 Limpiando archivos generados...$(RESET)"
	rm -rf .next
	rm -rf node_modules/.cache
	@echo "$(GREEN)✓ Limpieza completada$(RESET)"

seed:
	@echo "$(CYAN)🌱 Cargando datos iniciales...$(RESET)"
	node scripts/seed-knowledge.js

setup-local:
	@echo "$(CYAN)⚙️  Configuración local...$(RESET)"
	chmod +x scripts/setup-local.sh && ./scripts/setup-local.sh
