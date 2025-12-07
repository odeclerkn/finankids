# 🐷 FinanKids - Guía de Inicio Rápido

## Pre-requisitos

Solo necesitas tener instalado **Docker Desktop**:
- [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## 🚀 Opción 1: Inicio con Docker (Recomendado)

### Paso 1: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tu editor favorito y agrega:
```env
# Tu API key de OpenRouter (obtener en https://openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-v1-tu-key-aqui

# La URL de Convex se configurará automáticamente después
NEXT_PUBLIC_CONVEX_URL=https://placeholder.convex.cloud
```

### Paso 2: Iniciar con Docker

```bash
# Iniciar la aplicación
docker-compose up

# O en segundo plano
docker-compose up -d
```

### Paso 3: Abrir en el navegador

Visita: **http://localhost:3000**

---

## 🛠 Opción 2: Inicio sin Docker

### Paso 1: Instalar Node.js

Asegúrate de tener Node.js 18+ instalado:
- [Descargar Node.js](https://nodejs.org/)

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar

```bash
npm run setup
```

Sigue las instrucciones del asistente.

### Paso 4: Iniciar desarrollo

```bash
npm run dev
```

---

## ⚡ Configurar Convex (Base de Datos)

Convex es la base de datos en tiempo real. Para configurarla:

### 1. Crear cuenta en Convex
Visita [dashboard.convex.dev](https://dashboard.convex.dev) y crea una cuenta gratuita.

### 2. Inicializar Convex
```bash
npx convex dev
```

Esto:
- Te pedirá iniciar sesión
- Creará un nuevo proyecto
- Actualizará automáticamente tu `.env.local`

### 3. Configurar API Key de OpenRouter en Convex

**IMPORTANTE**: Para que el RAG funcione, debes agregar tu API key de OpenRouter a las variables de entorno de Convex:

```bash
npx convex env set OPENROUTER_API_KEY sk-or-v1-tu-key-aqui
```

### 4. Mantener Convex corriendo
Convex debe estar corriendo mientras desarrollas. Abre una terminal separada:

```bash
npx convex dev
```

---

## 📚 Configurar la Base de Conocimiento (RAG)

El sistema RAG permite que Finu (el tutor IA) responda usando información de la base de conocimiento.

### Opción A: Desde el Dashboard de Convex

1. Ve a [dashboard.convex.dev](https://dashboard.convex.dev)
2. Selecciona tu proyecto
3. Ve a la pestaña "Functions"
4. Ejecuta `seed:seedKnowledgeBase` para cargar los datos
5. Ejecuta `knowledge:generateAllEmbeddings` para generar los embeddings

### Opción B: Usando la API (con la app corriendo)

```bash
# Sembrar datos Y generar embeddings en un solo paso
curl -X POST http://localhost:3000/api/rag/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "seed-and-embed"}'

# Ver estadísticas
curl http://localhost:3000/api/rag/admin?view=stats
```

### Opción C: Comandos separados

```bash
# 1. Sembrar datos (sin embeddings)
curl -X POST http://localhost:3000/api/rag/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "seed"}'

# 2. Generar embeddings
curl -X POST http://localhost:3000/api/rag/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "generate-embeddings"}'
```

### Verificar que funciona

```bash
# Probar búsqueda RAG
curl -X POST http://localhost:3000/api/rag/search \
  -H "Content-Type: application/json" \
  -d '{"query": "¿Qué es el ahorro?", "age": 9}'
```

---

## 📱 Probando la Aplicación

Una vez iniciada, puedes:

1. **Página principal**: http://localhost:3000
2. **Dashboard niño**: http://localhost:3000/kid/dashboard
3. **Chat con Finu**: http://localhost:3000/kid/chat
4. **Simulador**: http://localhost:3000/kid/simulation
5. **Lecciones**: http://localhost:3000/kid/learn

---

## 🔑 Obtener API Key de OpenRouter

1. Ve a [openrouter.ai](https://openrouter.ai)
2. Crea una cuenta o inicia sesión
3. Ve a [openrouter.ai/keys](https://openrouter.ai/keys)
4. Crea una nueva API key
5. Copia la key y:
   - Pégala en tu `.env.local`
   - Configúrala en Convex: `npx convex env set OPENROUTER_API_KEY tu-key`

**Nota**: OpenRouter ofrece créditos gratuitos para empezar.

---

## 🐳 Comandos Docker Útiles

```bash
# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Reconstruir (si cambias Dockerfile)
docker-compose build --no-cache

# Limpiar todo
docker-compose down -v --rmi all
```

---

## 🆘 Solución de Problemas

### "Cannot find module 'convex/react'"
Ejecuta: `npm install`

### "OPENROUTER_API_KEY not configured"
Verifica que:
1. Tu `.env.local` tenga la API key correcta
2. Hayas configurado la key en Convex: `npx convex env set OPENROUTER_API_KEY tu-key`

### "Error en búsqueda RAG"
1. Asegúrate que Convex esté corriendo (`npx convex dev`)
2. Verifica que hayas sembrado los datos y generado embeddings
3. Revisa las stats: `curl http://localhost:3000/api/rag/admin?view=stats`

### Docker no inicia
1. Asegúrate que Docker Desktop esté corriendo
2. Intenta: `docker-compose down && docker-compose up --build`

### Página en blanco
1. Abre la consola del navegador (F12)
2. Verifica que no haya errores de JavaScript
3. Revisa los logs: `docker-compose logs -f`

---

## 📚 Arquitectura del RAG

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUJO RAG                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Usuario pregunta: "¿Qué es el ahorro?"                       │
│                           │                                     │
│                           ▼                                     │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │              API /api/rag/search                        │  │
│   └─────────────────────────────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │         Convex Action: knowledge.searchRAG              │  │
│   │                                                         │  │
│   │   1. Genera embedding de la pregunta (OpenRouter)       │  │
│   │   2. Búsqueda vectorial en knowledgeBase               │  │
│   │   3. Filtra por edad del usuario                        │  │
│   │   4. Retorna documentos relevantes                      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │              Agente Tutor (Finu)                        │  │
│   │                                                         │  │
│   │   System Prompt + RAG Context + User Message            │  │
│   │                    ↓                                    │  │
│   │              OpenRouter LLM                             │  │
│   │                    ↓                                    │  │
│   │         Respuesta personalizada                         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
finankids/
├── app/                 # Páginas y rutas (Next.js App Router)
│   ├── api/
│   │   ├── agents/     # Endpoints para agentes IA
│   │   └── rag/        # Endpoints RAG (search, admin)
│   ├── kid/            # Páginas para niños
│   └── parent/         # Páginas para padres
├── components/         # Componentes React
├── convex/             # Backend Convex
│   ├── schema.ts       # Esquema de base de datos
│   ├── knowledge.ts    # Funciones RAG (queries, mutations, actions)
│   └── seed.ts         # Datos iniciales
├── lib/                # Utilidades y lógica de negocio
│   ├── agents/         # Sistema de agentes IA
│   └── rag/            # Utilidades RAG (legacy)
├── scripts/            # Scripts de automatización
└── docker-compose.yml  # Configuración Docker
```

---

## 🎉 ¡Listo!

Si todo está funcionando, deberías ver la página de inicio de FinanKids con el cerdito animado.

Para verificar el RAG:
1. Ve a http://localhost:3000/kid/chat
2. Pregunta "¿Qué es el ahorro?"
3. Finu debería responder usando la información de la base de conocimiento

¿Problemas? Abre un issue en el repositorio.
