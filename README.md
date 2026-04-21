# Fondos Mamá · Seguimiento Cartera

Aplicación web para el seguimiento diario de la migración de cartera de fondos de **Maria Nieves Herrero Delgado** (Banco Sabadell → cartera optimizada).

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (base de datos PostgreSQL)
- **Recharts** (gráficas)
- **Vercel** (despliegue)

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard principal con KPIs comparativos y proyección |
| `/cartera-actual` | Detalle de los 49 fondos actuales en Sabadell |
| `/cartera-objetivo` | Los 12 fondos objetivo optimizados |
| `/migracion` | Seguimiento del plan de migración (49 traspasos en 6 meses) |
| `/proyeccion` | Proyecciones a 1 y 2 años + escenarios de mercado |
| `/admin` | Panel para actualizar valores diarios |

## Setup

### 1. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase/schema.sql`
3. Copia las credenciales: `Project URL` y `anon key`

### 2. Variables de entorno

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Desarrollo local

```bash
npm install
npm run dev
```

### 4. Despliegue en Vercel

1. Importa el repositorio desde [vercel.com/new](https://vercel.com/new)
2. Añade las variables de entorno en Settings → Environment Variables
3. Deploy automático en cada push a `main`

## Seguimiento diario

Para actualizar los valores diarios:

1. Accede a `/admin`
2. Selecciona la fecha
3. Introduce el valor total de la cartera actual (desde la web de Sabadell)
4. Introduce el valor de cada fondo objetivo (desde Morningstar o Sabadell)
5. Guarda

**Frecuencia recomendada:** 1 vez por semana (los fondos publican VL con 1-2 días de retardo).

## Resumen del plan de migración

- **Total a migrar:** 84.131 € (sobre 91.665 €)
- **Traspasos:** 49 operaciones en 6 meses (Mayo–Octubre 2026)
- **Ahorro anual:** 828 € en comisiones (+0.9%/año)
- **Proyección 2 años:** +7.718 € a favor de migrar (incluso en escenario pesimista -15%)

### Alerta urgente
Negociar clase institucional del **Man Alpha Select Alternative** con Sabadell antes de ejecutar la migración. Coste actual 2.97% vs rentabilidad 2.86% = rentabilidad neta ≈ 0.
