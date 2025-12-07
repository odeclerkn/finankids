#!/usr/bin/env node
/**
 * FinanKids - Script de Configuración Inicial
 *
 * Este script te guía paso a paso para configurar el proyecto.
 *
 * Uso: npm run setup
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (prompt) =>
  new Promise((resolve) => rl.question(prompt, resolve))

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.magenta}▸${colors.reset} ${colors.bright}${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}\n`),
}

async function main() {
  console.clear()
  log.title('🐷 FinanKids - Configuración Inicial')
  console.log('Este asistente te ayudará a configurar el proyecto.\n')

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local')
  const envExists = fs.existsSync(envPath)

  if (envExists) {
    const overwrite = await question(
      'Ya existe un archivo .env.local. ¿Deseas sobreescribirlo? (s/n): '
    )
    if (overwrite.toLowerCase() !== 's') {
      log.info('Manteniendo configuración existente.')
      rl.close()
      return
    }
  }

  // Collect configuration
  log.step('Paso 1: OpenRouter API Key')
  console.log('Obtén tu API key en: https://openrouter.ai/keys')
  const openrouterKey = await question('OpenRouter API Key: ')

  log.step('Paso 2: Convex')
  console.log('Necesitas crear un proyecto en Convex: https://dashboard.convex.dev')
  console.log('Después de crear el proyecto, ejecuta: npx convex dev')
  console.log('(Puedes dejar esto vacío por ahora y configurarlo después)')
  const convexUrl = await question('Convex URL (o Enter para saltar): ')

  // Generate .env.local
  const envContent = `# ===================================
# FinanKids - Variables de Entorno
# ===================================
# Generado automáticamente el ${new Date().toLocaleDateString()}

# OpenRouter API Key
OPENROUTER_API_KEY=${openrouterKey}

# Convex
# Esta URL se actualiza automáticamente al ejecutar 'npx convex dev'
NEXT_PUBLIC_CONVEX_URL=${convexUrl || 'https://tu-proyecto.convex.cloud'}

# URL de la aplicación (para callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
`

  fs.writeFileSync(envPath, envContent)
  log.success('.env.local creado correctamente')

  // Show next steps
  log.title('✅ Configuración completada')
  console.log('Próximos pasos:\n')
  console.log('  1. Configura Convex (si no lo has hecho):')
  console.log('     npx convex dev\n')
  console.log('  2. Inicia el servidor de desarrollo:')
  console.log('     npm run dev\n')
  console.log('     O con Docker:')
  console.log('     docker-compose up\n')
  console.log('  3. Abre http://localhost:3000 en tu navegador\n')

  rl.close()
}

main().catch((error) => {
  console.error('Error durante la configuración:', error)
  rl.close()
  process.exit(1)
})
