#!/usr/bin/env node
/**
 * FinanKids - Script para Sembrar Base de Conocimiento
 *
 * Este script carga el contenido inicial en Convex para el sistema RAG.
 *
 * Uso: npm run seed
 */

const SEED_KNOWLEDGE = [
  {
    title: '¿Qué es el ahorro?',
    content: `El ahorro es guardar una parte del dinero que recibes para usarlo después. Es como cuando guardas dulces de Halloween para comerlos poco a poco en lugar de comértelos todos de una vez.

Imagina que tienes una alcancía mágica: cada moneda que pones crece un poquito con el tiempo. Eso es lo que pasa cuando ahorras en el mundo real.

¿Por qué es importante ahorrar?
- Para comprar algo que quieres mucho (un juguete especial, un videojuego)
- Para emergencias (si se rompe algo importante)
- Para tu futuro (cuando seas grande)

Un buen hábito es guardar al menos 1 de cada 10 monedas que recibas. ¡Así verás crecer tu dinero!`,
    category: 'ahorro',
    subcategory: 'conceptos_basicos',
    tags: ['ahorro', 'alcancía', 'dinero', 'básico'],
    ageRange: { min: 6, max: 10 },
    difficulty: 'beginner',
  },
  {
    title: 'La regla del 50-30-20 para niños',
    content: `De cada 10 monedas que recibas:
🏠 5 monedas (50%) - Para cosas que NECESITAS
🎮 3 monedas (30%) - Para cosas que QUIERES
🐷 2 monedas (20%) - Para AHORRAR

Por ejemplo, si tu mesada es de $100 pesos:
- $50 para cosas necesarias (útiles escolares, comida del recreo)
- $30 para diversión (juegos, dulces, salidas)
- $20 para tu alcancía`,
    category: 'ahorro',
    subcategory: 'presupuesto',
    tags: ['presupuesto', 'regla', 'división', 'mesada'],
    ageRange: { min: 8, max: 14 },
    difficulty: 'beginner',
  },
  {
    title: '¿Qué son los impuestos?',
    content: `Los impuestos son como una "cuota del club" que todos pagamos para vivir en sociedad.

¿PARA QUÉ SIRVEN?
El gobierno usa ese dinero para pagar cosas que TODOS usamos:
🏫 Escuelas públicas
🏥 Hospitales
🚒 Bomberos y policías
🛣️ Carreteras y puentes
🌳 Parques`,
    category: 'impuestos',
    subcategory: 'conceptos_basicos',
    tags: ['impuestos', 'IVA', 'gobierno', 'servicios'],
    ageRange: { min: 9, max: 14 },
    difficulty: 'intermediate',
  },
]

async function main() {
  console.log('🌱 FinanKids - Sembrador de Base de Conocimiento\n')

  // Check if Convex is configured
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

  if (!convexUrl || convexUrl.includes('tu-proyecto')) {
    console.log('⚠️  Convex no está configurado.')
    console.log('   Ejecuta primero: npx convex dev')
    console.log('   Luego vuelve a ejecutar este script.\n')

    console.log('📚 Por ahora, el contenido se carga desde archivos locales.')
    console.log('   Ver: lib/rag/seed-data.ts\n')
    return
  }

  console.log('Conectando a Convex...')
  console.log(`URL: ${convexUrl}\n`)

  // In a real implementation, we would use the Convex client here
  console.log(`📝 Se cargarían ${SEED_KNOWLEDGE.length} documentos a la base de conocimiento.`)
  console.log('\nPara cargar el contenido:')
  console.log('1. Ejecuta: npx convex dev')
  console.log('2. Usa el dashboard de Convex para ver los datos')
  console.log('3. O implementa la lógica de carga en este script\n')
}

main().catch(console.error)
