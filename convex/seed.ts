import { mutation, action, internalMutation } from './_generated/server'
import { v } from 'convex/values'
import { internal, api } from './_generated/api'

// Datos de seed para la base de conocimiento
const SEED_KNOWLEDGE = [
  // AHORRO - Conceptos básicos
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
    difficulty: 'beginner' as const,
  },
  {
    title: 'La regla del 50-30-20 para niños',
    content: `¿Sabías que hay una forma súper fácil de dividir tu dinero? Se llama la regla del 50-30-20, pero para niños la haremos más simple:

De cada 10 monedas que recibas:
🏠 5 monedas (50%) - Para cosas que NECESITAS
🎮 3 monedas (30%) - Para cosas que QUIERES
🐷 2 monedas (20%) - Para AHORRAR

Por ejemplo, si tu mesada es de $100 pesos:
- $50 para cosas necesarias (útiles escolares, comida del recreo)
- $30 para diversión (juegos, dulces, salidas)
- $20 para tu alcancía

¡Así siempre tendrás dinero guardado y también podrás divertirte!`,
    category: 'ahorro',
    subcategory: 'presupuesto',
    tags: ['presupuesto', 'regla', 'división', 'mesada'],
    ageRange: { min: 8, max: 14 },
    difficulty: 'beginner' as const,
  },
  {
    title: 'Metas de ahorro',
    content: `Ahorrar es más fácil cuando tienes una META - algo que quieres conseguir.

Cómo crear tu meta de ahorro:
1. ELIGE qué quieres comprar (un juguete, videojuego, etc.)
2. INVESTIGA cuánto cuesta
3. CALCULA cuánto puedes ahorrar cada semana
4. DIVIDE el precio entre tu ahorro semanal

Ejemplo:
- Quieres: Una pelota que cuesta $200
- Ahorras: $25 por semana
- 200 ÷ 25 = 8 semanas para conseguirla

TIPS para lograr tu meta:
⭐ Dibuja o pega una foto de lo que quieres
⭐ Haz una gráfica para ver tu progreso
⭐ Celebra cada vez que avances
⭐ No te rindas, ¡cada moneda cuenta!`,
    category: 'ahorro',
    subcategory: 'metas',
    tags: ['metas', 'objetivos', 'planificación'],
    ageRange: { min: 7, max: 12 },
    difficulty: 'beginner' as const,
  },

  // GASTOS E INGRESOS
  {
    title: '¿De dónde viene el dinero?',
    content: `El dinero no aparece mágicamente - hay que ganarlo. Aquí te explicamos cómo:

FORMAS DE GANAR DINERO:
💼 Trabajando - Los adultos van a trabajar y les pagan un "salario"
🏠 Ayudando en casa - Algunos papás dan mesada por ayudar
🎨 Vendiendo cosas - Si haces pulseras, dibujos, galletas...
🎁 Regalos - En cumpleaños o fechas especiales

¿QUÉ ES UN SALARIO?
Es el dinero que le pagan a alguien por su trabajo. Por ejemplo:
- Un maestro gana dinero por enseñar
- Un doctor gana dinero por curar enfermos
- Un panadero gana dinero por hacer pan

DATO CURIOSO:
El salario se llama así porque hace muuuucho tiempo, a los soldados romanos les pagaban con SAL (que era muy valiosa). ¡Por eso "salario"!`,
    category: 'ingresos',
    subcategory: 'conceptos_basicos',
    tags: ['ingresos', 'salario', 'trabajo', 'dinero'],
    ageRange: { min: 6, max: 10 },
    difficulty: 'beginner' as const,
  },
  {
    title: 'Gastos fijos y gastos variables',
    content: `No todos los gastos son iguales. Hay dos tipos principales:

GASTOS FIJOS 🏠
Son los que se pagan SIEMPRE, cada mes, y cuestan lo mismo:
- Renta de la casa (donde vivimos)
- Internet y teléfono
- Escuela
- Seguros

GASTOS VARIABLES 🛒
Son los que CAMBIAN cada mes:
- Comida (a veces más, a veces menos)
- Diversión (cine, juegos)
- Ropa
- Regalos

¿POR QUÉ ES IMPORTANTE SABERLO?
Porque los gastos fijos SIEMPRE hay que pagarlos primero. Son como las reglas del juego que no puedes cambiar. Los variables son los que puedes ajustar si necesitas ahorrar más.

EJEMPLO EN TU VIDA:
- Gasto fijo: Tu pasaje al colegio (siempre igual)
- Gasto variable: Los dulces que compras (puedes comprar más o menos)`,
    category: 'gastos',
    subcategory: 'tipos',
    tags: ['gastos', 'fijos', 'variables', 'presupuesto'],
    ageRange: { min: 9, max: 14 },
    difficulty: 'intermediate' as const,
  },

  // INVERSIONES
  {
    title: '¿Qué es invertir?',
    content: `Invertir es poner tu dinero a "trabajar" para que crezca solo.

LA DIFERENCIA ENTRE AHORRAR E INVERTIR:
🐷 Ahorrar = Guardar dinero en un lugar seguro (alcancía, banco)
📈 Invertir = Usar ese dinero para ganar MÁS dinero

EJEMPLOS SIMPLES DE INVERSIÓN:
1. LA LIMONADA: Si compras limones por $10 y haces limonada que vendes por $30, ¡invertiste $10 y ganaste $20!

2. LAS ESTAMPAS: Si compras un paquete de estampas raras por $50 y las vendes después por $100, ¡duplicaste tu dinero!

3. APRENDER: Invertir en clases o cursos. Si aprendes a hacer algo (cocinar, programar), después puedes ganar dinero con eso.

IMPORTANTE:
⚠️ Invertir tiene RIESGOS - a veces puedes perder dinero
⚠️ Por eso es importante aprender bien antes de invertir
⚠️ Nunca inviertas dinero que necesitas para cosas importantes`,
    category: 'inversiones',
    subcategory: 'conceptos_basicos',
    tags: ['inversión', 'crecimiento', 'riesgo', 'ganancia'],
    ageRange: { min: 10, max: 14 },
    difficulty: 'intermediate' as const,
  },
  {
    title: 'El interés compuesto: tu superpoder financiero',
    content: `Imagina que plantas una semilla mágica que cada año produce más semillas, y esas semillas también producen más semillas. ¡Así funciona el interés compuesto!

¿QUÉ ES EL INTERÉS?
Es el "premio" que te dan por dejar tu dinero guardado en el banco. Si guardas $100 y el banco te da 10% de interés, al año tendrás $110.

¿QUÉ ES EL INTERÉS COMPUESTO?
Es cuando ese premio también gana premio. Mira:

Año 1: $100 + 10% = $110
Año 2: $110 + 10% = $121 (¡no $120!)
Año 3: $121 + 10% = $133
Año 10: ¡Casi $260!

EL TRUCO MÁGICO:
Mientras más tiempo dejes tu dinero, más crece. Por eso los adultos dicen "empieza a ahorrar joven".

Einstein dijo que el interés compuesto es "la fuerza más poderosa del universo". ¡Y tenía razón!`,
    category: 'inversiones',
    subcategory: 'interes_compuesto',
    tags: ['interés', 'compuesto', 'crecimiento', 'tiempo'],
    ageRange: { min: 11, max: 14 },
    difficulty: 'intermediate' as const,
  },

  // IMPUESTOS
  {
    title: '¿Qué son los impuestos?',
    content: `Los impuestos son como una "cuota del club" que todos pagamos para vivir en sociedad.

¿PARA QUÉ SIRVEN?
El gobierno usa ese dinero para pagar cosas que TODOS usamos:
🏫 Escuelas públicas
🏥 Hospitales
🚒 Bomberos y policías
🛣️ Carreteras y puentes
🌳 Parques

TIPOS DE IMPUESTOS:
1. IVA (Impuesto al Valor Agregado)
   - Se paga al comprar cosas
   - Cuando compras un juguete de $100, en realidad $16 son de impuesto

2. ISR (Impuesto Sobre la Renta)
   - Lo pagan los adultos de su salario
   - Quien gana más, paga más

¿ES JUSTO PAGAR IMPUESTOS?
Piénsalo así: si nadie pagara, ¿quién arreglaría las calles? ¿Quién pagaría a los maestros? Los impuestos son la forma de que todos ponemos un poco para el bien de todos.`,
    category: 'impuestos',
    subcategory: 'conceptos_basicos',
    tags: ['impuestos', 'IVA', 'gobierno', 'servicios'],
    ageRange: { min: 9, max: 14 },
    difficulty: 'intermediate' as const,
  },

  // EMPRENDIMIENTO
  {
    title: 'Tu primer negocio',
    content: `¿Sabías que puedes empezar un negocio siendo niño? ¡Muchos empresarios famosos empezaron de pequeños!

IDEAS DE NEGOCIOS PARA NIÑOS:
🍪 Vender galletas o postres (con ayuda de un adulto)
🎨 Hacer y vender arte o manualidades
🐕 Pasear perros o cuidar mascotas
🧹 Ayudar a vecinos con tareas del jardín
📚 Dar clases de algo que sepas (videojuegos, deportes)

PASOS PARA EMPEZAR:
1. IDEA: ¿Qué puedes hacer o vender?
2. COSTO: ¿Cuánto te cuesta hacerlo?
3. PRECIO: ¿Por cuánto lo venderás?
4. CLIENTES: ¿Quién lo compraría?
5. ¡ACCIÓN!: ¡Empieza pequeño!

CONSEJO DE ORO:
Tu precio debe ser MAYOR que tu costo. Si las galletas te cuestan $20 hacerlas, véndelas al menos en $35. La diferencia ($15) es tu GANANCIA.

¡Pide permiso a tus papás y empieza tu aventura emprendedora!`,
    category: 'emprendimiento',
    subcategory: 'primeros_pasos',
    tags: ['negocio', 'emprender', 'vender', 'ideas'],
    ageRange: { min: 8, max: 14 },
    difficulty: 'beginner' as const,
  },

  // DEUDAS Y CRÉDITO
  {
    title: '¿Qué es una deuda?',
    content: `Una deuda es cuando alguien te presta algo (generalmente dinero) y tú prometes devolverlo.

EJEMPLO SIMPLE:
Tu amigo te presta $20 para comprar un helado. Ahora le DEBES $20. Eso es una deuda.

DEUDAS BUENAS VS DEUDAS MALAS:
✅ Deuda buena: Pedir prestado para algo que te ayudará a ganar más dinero (estudiar, un negocio)
❌ Deuda mala: Pedir prestado para cosas que no necesitas (el último juguete de moda)

¿QUÉ ES EL INTERÉS EN LAS DEUDAS?
Cuando alguien te presta dinero, generalmente quiere algo extra de regreso. Si te prestan $100 con 10% de interés, tendrás que devolver $110.

REGLA IMPORTANTE:
🚨 Nunca pidas prestado más de lo que puedes pagar
🚨 Las deudas pueden crecer muy rápido por los intereses
🚨 Siempre es mejor ahorrar primero que endeudarse`,
    category: 'deudas',
    subcategory: 'conceptos_basicos',
    tags: ['deuda', 'préstamo', 'interés', 'crédito'],
    ageRange: { min: 10, max: 14 },
    difficulty: 'intermediate' as const,
  },

  // BANCOS
  {
    title: '¿Cómo funcionan los bancos?',
    content: `Los bancos son como grandes alcancías donde muchas personas guardan su dinero. ¡Pero hacen mucho más que solo guardar!

¿QUÉ HACE UN BANCO?
1. GUARDA tu dinero de forma segura
2. Te PAGA un poco extra (interés) por dejarlo ahí
3. PRESTA dinero a otras personas
4. Te da una TARJETA para pagar sin efectivo

¿CÓMO GANAN DINERO LOS BANCOS?
¡Aquí está el truco!
- Te pagan 5% por guardar tu dinero
- Prestan ese dinero a otros cobrando 15%
- La diferencia (10%) es su ganancia

TU CUENTA DE BANCO:
Cuando seas más grande, podrás tener tu propia cuenta. Hay cuentas especiales para niños donde tus papás te ayudan a administrarla.

VOCABULARIO BANCARIO:
💳 Cuenta: Donde guardas tu dinero
💳 Depósito: Meter dinero
💳 Retiro: Sacar dinero
💳 Saldo: Cuánto tienes guardado`,
    category: 'bancos',
    subcategory: 'conceptos_basicos',
    tags: ['banco', 'cuenta', 'tarjeta', 'depósito'],
    ageRange: { min: 8, max: 14 },
    difficulty: 'beginner' as const,
  },

  // ECONOMÍA BÁSICA
  {
    title: 'Oferta y demanda explicado con juguetes',
    content: `¿Por qué algunas cosas cuestan más que otras? ¡Por la oferta y la demanda!

DEMANDA: Cuántas personas QUIEREN algo
OFERTA: Cuántas de esas cosas HAY disponibles

EJEMPLO CON JUGUETES:
Imagina que sale un nuevo juguete súper popular:
- MUCHOS niños lo quieren (alta demanda)
- Pero hay POCOS en las tiendas (baja oferta)
- Resultado: ¡El precio SUBE!

Ahora imagina después de Navidad:
- Menos niños lo quieren (baja demanda)
- Las tiendas tienen muchos (alta oferta)
- Resultado: ¡El precio BAJA! (ofertas y descuentos)

ESTO PASA EN TODO:
🎮 Videojuegos nuevos cuestan más que los viejos
🍎 Frutas de temporada son más baratas
👟 Tenis de moda cuestan más
🎫 Boletos de cine en estreno cuestan más

¿Por qué importa saberlo?
¡Porque puedes esperar el momento correcto para comprar y ahorrar dinero!`,
    category: 'economia',
    subcategory: 'oferta_demanda',
    tags: ['oferta', 'demanda', 'precios', 'economía'],
    ageRange: { min: 9, max: 14 },
    difficulty: 'intermediate' as const,
  },
]

// Mutation para sembrar todos los datos (sin embeddings)
export const seedKnowledgeBase = mutation({
  args: {},
  handler: async (ctx) => {
    // Verificar si ya hay datos
    const existing = await ctx.db.query('knowledgeBase').first()
    if (existing) {
      return {
        success: false,
        message: 'La base de conocimiento ya tiene datos. Usa clearAll primero si quieres recargar.',
        existingCount: (await ctx.db.query('knowledgeBase').collect()).length
      }
    }

    const now = Date.now()
    let inserted = 0

    for (const item of SEED_KNOWLEDGE) {
      await ctx.db.insert('knowledgeBase', {
        ...item,
        embedding: undefined,
        createdAt: now,
        updatedAt: now,
      })
      inserted++
    }

    return {
      success: true,
      inserted,
      message: `Se insertaron ${inserted} documentos. Ahora ejecuta generateAllEmbeddings para generar los embeddings.`
    }
  },
})

// Action para sembrar y generar embeddings en un solo paso
export const seedAndEmbed = action({
  args: {},
  handler: async (ctx) => {
    // 1. Primero sembrar los datos
    const seedResult = await ctx.runMutation(internal.seed.seedKnowledgeBaseInternal, {})

    if (!seedResult.success) {
      return seedResult
    }

    // 2. Generar embeddings (usando api porque es una action pública)
    const embedResult = await ctx.runAction(api.knowledge.generateAllEmbeddings, {})

    return {
      success: true,
      seeded: seedResult.inserted,
      embedded: embedResult.processed,
      errors: embedResult.errors,
    }
  },
})

// Internal mutation para el seed (solo llamable desde otras funciones de servidor)
export const seedKnowledgeBaseInternal = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('knowledgeBase').first()
    if (existing) {
      return {
        success: false,
        message: 'Ya hay datos',
        inserted: 0
      }
    }

    const now = Date.now()
    let inserted = 0

    for (const item of SEED_KNOWLEDGE) {
      await ctx.db.insert('knowledgeBase', {
        ...item,
        embedding: undefined,
        createdAt: now,
        updatedAt: now,
      })
      inserted++
    }

    return { success: true, inserted }
  },
})
