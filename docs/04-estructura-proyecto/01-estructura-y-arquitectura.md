# Capítulo 04: Estructura y Funcionamiento del Proyecto Next.js

Este documento proporciona un desglose técnico, descriptivo y exhaustivo de la **estructura real del código fuente** del proyecto de tesis. A diferencia de una guía teórica estándar, esta sección documenta detalladamente la arquitectura, carpetas, componentes y archivos de configuración efectivamente existentes dentro del repositorio actual.

---

## 1. Objetivo del capítulo

El propósito de este capítulo es brindar un mapa de orientación claro y transparente para cualquier persona que abra el repositorio por primera vez, permitiendo responder con precisión:

- **¿Dónde está cada parte del proyecto?**
- **¿Qué función cumple cada carpeta?**
- **¿Dónde se encuentra el código de cada página de la aplicación?**
- **¿Dónde residen los componentes reutilizables de la interfaz?**
- **¿Dónde se ubican las configuraciones de la base de datos, tipos y librerías de mapas?**
- **¿Cómo se relacionan los distintos archivos entre sí?**

Con este capítulo, se evita la necesidad de inspeccionar manualmente cada archivo para comprender la organización global del sistema.

---

## 2. Raíz del proyecto

Se denomina **raíz del proyecto** a la carpeta principal que agrupa la totalidad del repositorio de la aplicación web.

En este sistema, la raíz corresponde al directorio:

```text
my-app/
```

### ¿Cómo reconocer la raíz de una aplicación Node.js/Next.js?

La raíz se identifica inequívocamente por la presencia del archivo **`package.json`**. Desde esta ubicación exacta es desde donde deben ejecutarse todos los comandos de la terminal, tales como:

```bash
npm run dev
```

o

```bash
npm run build
```

---

## 3. Árbol general del proyecto

A continuación se presenta el mapa de archivos y carpetas **realmente existente** en la raíz del repositorio:

```text
my-app/
├── app/                        # Rutas, layouts y páginas principales de Next.js (App Router)
│   ├── estaciones/             # Ruta `/estaciones` (Vista de maquetado del panel IoT)
│   │   └── page.tsx
│   ├── mapa/                   # Ruta `/mapa` (Vista dedicada al mapa a pantalla completa)
│   │   └── page.tsx
│   ├── test-db/                # Ruta `/test-db` (Vista de prueba de lectura de Supabase)
│   │   └── page.tsx
│   ├── favicon.ico             # Icono de la pestaña web
│   ├── globals.css             # Estilos globales y directivas de Tailwind CSS
│   ├── layout.tsx              # Layout raíz global con la barra de navegación
│   └── page.tsx                # Landing page / Página de inicio del proyecto
├── src/                        # Código fuente modular (Componentes, tipos, librerías, data)
│   ├── components/             # 11 componentes React de interfaz y mapas
│   ├── data/                   # Datos estáticos y mocks (`reports.ts`)
│   ├── lib/                    # Clientes de integración (`supabase.ts`)
│   └── types/                  # Definiciones de tipos TypeScript (`report.ts`)
├── public/                     # Recursos gráficos estáticos accesibles públicamente (SVGs)
├── docs/                       # Documentación estructurada del proyecto de tesis
├── scratch/                    # Scripts utilitarios en Node.js para pruebas e inserciones
├── .env.local                  # Variables de entorno locales (URL y claves de Supabase)
├── .gitignore                  # Reglas de archivos excluidos del control de versiones Git
├── AGENTS.md                   # Reglas y contexto para asistentes de Inteligencia Artificial
├── CLAUDE.md                   # Acceso directo al archivo AGENTS.md
├── eslint.config.mjs           # Configuración del linter de código ESLint
├── next-env.d.ts               # Declaraciones de tipos autogeneradas por Next.js
├── next.config.ts              # Configuración de Next.js (patrones de imágenes remotas)
├── package.json                # Manifest del proyecto (scripts y dependencias)
├── package-lock.json           # Registro de versiones fijas del árbol de dependencias
├── postcss.config.mjs          # Configuración del procesador CSS para Tailwind
├── proxy.ts                    # Middleware/Proxy de pasarela de la aplicación
├── tsconfig.json               # Configuración del compilador TypeScript y alias `@/*`
└── tsconfig.tsbuildinfo        # Caché de compilación incremental de TypeScript
```

*(Nota: Los directorios autogenerados `.next/` y `node_modules/` se omiten de este árbol general y se analizan en una sección específica).*

---

## 4. Carpeta `app/`

La carpeta `app/` implementa el paradigma **App Router** de Next.js. Cada subcarpeta creada dentro de `app/` que contenga un archivo `page.tsx` se transforma automáticamente en una ruta web accesible en la aplicación.

### Inspección del contenido de `app/`

- **`layout.tsx` (Layout Raíz)**: Define la estructura HTML global (`<html>`, `<body>`), importa los estilos globales `globals.css`, configura las fuentes tipográficas `Geist` y renderiza la barra de navegación persistente (`Navigation`) alrededor de todas las páginas.
- **`page.tsx` (Página Principal `/`)**: Es la página de inicio (*Landing Page*). Muestra una sección de presentación (*Hero Section*), resúmenes informativos de la problemática en el AMA y un botón de acción principal para ingresar al mapa interactivo.
- **`globals.css`**: Archivo de hoja de estilos global. Contiene las directivas de importación de Tailwind CSS y configuraciones de pantalla completa.
- **`app/mapa/page.tsx` (Ruta `/mapa`)**: Vista dedicada exclusivamente a renderizar el componente del mapa interactivo (`MapClient`) a pantalla completa.
- **`app/estaciones/page.tsx` (Ruta `/estaciones`)**: Vista de maquetado del panel de monitoreo de estaciones meteorológicas e hidrométricas (en desarrollo).
- **`app/test-db/page.tsx` (Ruta `/test-db`)**: Vista técnica utilitaria creada para verificar la conexión directa y la lectura de registros desde la base de datos de Supabase.

---

## 5. Carpeta `src/`

Para mantener la aplicación ordenada, el proyecto utiliza la carpeta `src/` como contenedor principal de los módulos de lógica de negocio, interfaz de usuario y configuraciones auxiliares.

### Árbol resumido de `src/`

```text
src/
├── components/         # Componentes visuales e interactivos de React
├── data/               # Conjuntos de datos locales y mocks de prueba
├── lib/                # Inicialización de servicios (Supabase)
└── types/              # Definiciones de TypeScript e interfaces de datos
```

### Descripción de subcarpetas

1. **`src/components/`**: Aloja los 11 componentes React de interfaz gráfica (formularios, marcadores, controles de mapa, paneles de filtro y listas).
2. **`src/data/`**: Contiene `reports.ts`, un conjunto de datos estáticos de prueba (reportes simulados con coordenadas) para desarrollo en entorno desconectado.
3. **`src/lib/`**: Contiene `supabase.ts`, la configuración de conexión que inicializa el cliente de Supabase consumiendo las variables de entorno `.env.local`.
4. **`src/types/`**: Contiene `report.ts`, donde se definen las interfaces TypeScript (`Report`, `Severity`, `ReportStatus`, etc.) para asegurar que los objetos de datos tengan estructuras coherentes en toda la aplicación.

---

## 6. Componentes React

Un **componente React** es una pieza de código independiente, reutilizable y encapsulada que define tanto la apariencia visual como el comportamiento interactivo de una parte de la interfaz.

### Catálogo de componentes reales en `src/components/`

Actualmente, el proyecto cuenta con 11 componentes desarrollados:

| Componente | Archivo en `src/components/` | Función principal y relaciones |
| :--- | :--- | :--- |
| **`Navigation`** | [`Navigation.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/Navigation.tsx) | Barra de navegación superior persistente. Incluye enlaces a `/`, `/mapa` y `/estaciones`. |
| **`MapView`** | [`MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx) | Componente central del mapa cartográfico (Leaflet). Integra capas base, marcadores y filtros. |
| **`MapClient`** | [`MapClient.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapClient.tsx) | Envoltorio con carga dinámica (`dynamic import` con `ssr: false`) para renderizar `MapView` solo en el cliente. |
| **`ReportForm`** | [`ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx) | Formulario modal para el envío de nuevos reportes ciudadanos (coordenadas, descripción, imagen y etiquetas). |
| **`FilterPanel`** | [`FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx) | Panel flotante de controles para filtrar marcadores por estado, fechas, gravedad y mapas de calor. |
| **`SidebarReports`** | [`SidebarReports.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SidebarReports.tsx) | Panel lateral desplegable que lista los reportes activos y sus detalles completos. |
| **`ReportMarker`** | [`ReportMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportMarker.tsx) | Marcador individual en el mapa para representar un reporte ciudadano con ventana emergente (*popup*). |
| **`NewsMarker`** | [`NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx) | Marcador en el mapa especializado en renderizar noticias históricas de inundaciones. |
| **`HeatmapLayer`** | [`HeatmapLayer.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/HeatmapLayer.tsx) | Capa de acumulación de calor (*heatmap*) para la densidad de eventos sobre el mapa. |
| **`SearchBar`** | [`SearchBar.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SearchBar.tsx) | Barra de búsqueda de ubicaciones y puntos de interés sobre la cartografía. |
| **`CustomZoomControl`** | [`CustomZoomControl.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/CustomZoomControl.tsx) | Botones personalizados para acercar y alejar el mapa interactivo. |

---

## 7. Páginas y rutas

Next.js convierte automáticamente la jerarquía de carpetas dentro de `app/` en las URL navegables por el usuario.

### Tabla de rutas comprobadas en el proyecto

| Ruta URL | Archivo de origen | Estado y Función en la Plataforma |
| :--- | :--- | :--- |
| **`/`** | [`app/page.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/app/page.tsx) | **Página de Inicio (Landing)**: Presentación del proyecto, contexto de Asunción y acceso principal al mapa. |
| **`/mapa`** | [`app/mapa/page.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/app/mapa/page.tsx) | **Visor Cartográfico**: Visualización completa e interactiva del mapa, reportes, noticias y filtros. |
| **`/estaciones`** | [`app/estaciones/page.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/app/estaciones/page.tsx) | **Panel de Estaciones IoT**: Interfaz de maquetado para la futura red de sensores en el arroyo Mburicaó. |
| **`/test-db`** | [`app/test-db/page.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/app/test-db/page.tsx) | **Ruta de Prueba Técnica**: Consulta directa en formato JSON de la tabla `reportes` en Supabase. |

---

## 8. Carpeta `public/`

La carpeta `public/` contiene recursos estáticos que el servidor entrega directamente al navegador sin ser procesados por el compilador de JavaScript.

### Recursos identificados en `public/`

- **`file.svg`**, **`globe.svg`**, **`next.svg`**, **`vercel.svg`**, **`window.svg`**: Archivos de gráficos vectoriales generados por la plantilla base de Next.js para renderizado de íconos.

### Acceso a recursos de `public/`

Cualquier archivo dentro de `public/` es accesible en la web desde la raíz del dominio. Por ejemplo, el archivo `public/globe.svg` se consume en el código escribiendo simplemente la ruta `/globe.svg`.

---

## 9. Carpeta `scratch/`

La carpeta `scratch/` es un directorio utilitario local para scripts experimentales o tareas administrativas fuera del flujo web principal.

### Contenido de `scratch/`

- **`test_supabase.js`**: Script ejecutable con Node.js para probar credenciales de conexión con Supabase.
- **`insert_report.js`**: Script auxiliar para insertar un reporte de prueba directo en la base de datos.
- **`insert_samples.js`**: Script masivo para poblar la base de datos con datos de prueba geolocalizados en Asunción.
- **`check_news_coords.js`**: Script de verificación de coordenadas geográficas en las noticias históricas.

> [!NOTE]
> Los archivos en `scratch/` corresponden a pruebas y utilidades de backend ejecutadas mediante la terminal (`node scratch/insert_samples.js`). No forman parte directa del código compilado de la aplicación frontend en produción.

---

## 10. `package.json`

El archivo [`package.json`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json) define las órdenes de ejecución y las librerías del proyecto.

### Scripts disponibles

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

- **`npm run dev`**: Inicia el servidor de desarrollo en `http://localhost:3000` con recarga en vivo.
- **`npm run build`**: Compila y optimiza la aplicación para su posterior despliegue en producción.
- **`npm run start`**: Inicia el servidor de producción después de haber ejecutado `npm run build`.
- **`npm run lint`**: Ejecuta la revisión estática de código con ESLint.

### Clasificación de dependencias instaladas

- **Frontend & Framework**: `next` (16.2.4), `react` (19.2.4), `react-dom` (19.2.4).
- **Mapas y Geoespacial**: `leaflet` (^1.9.4), `react-leaflet` (^5.0.0), `leaflet.heat` (^0.2.0), `@types/leaflet`.
- **Base de Datos y Backend**: `@supabase/supabase-js` (^2.105.3).
- **Interfaz e Íconos**: `lucide-react` (^1.14.0), `date-fns` (^4.1.0).
- **Herramientas de Desarrollo**: `tailwindcss` (^4), `typescript` (^5), `eslint` (^9).

---

## 11. `package-lock.json`

El archivo `package-lock.json` se genera automáticamente por `npm` cada vez que se instala o modifica un paquete.

- **Función**: Registra con absoluta precisión las versiones exactas, hashes de integridad y subdependencias descargadas.
- **Diferencia con `package.json`**: `package.json` utiliza rangos flexibles (ej. `^1.9.4`), mientras que `package-lock.json` fija la versión exacta instalada.
- **Uso en Git**: Se debe mantener bajo control de versiones para garantizar que cualquier persona que clone el repositorio e instale el proyecto con `npm install` obtenga un entorno idéntico y reproducible.

---

## 12. `tsconfig.json`

El archivo [`tsconfig.json`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/tsconfig.json) establece la configuración del compilador de TypeScript.

### Opciones relevantes del proyecto

- **`"target": "ES2017"`**: Define la versión de JavaScript producida durante la compilación.
- **`"strict": true`**: Habilita todas las verificaciones estrictas de tipos para prevenir valores nulos o no definidos.
- **`"paths": { "@/*": ["./src/*"] }`**: Configura el alias de importación, permitiendo que `@/components/ReportForm` apunte a `./src/components/ReportForm`.

---

## 13. `next.config.ts`

El archivo [`next.config.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/next.config.ts) contiene configuraciones avanzadas para el servidor de Next.js.

### Inspección del código real

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'gexfcndaymqdnuobjxnb.supabase.co' },
    ],
  },
};

export default nextConfig;
```

- **Función**: Configura el componente de imágenes de Next.js (`<Image />`) permitiendo la carga y optimización segura de imágenes provenientes de dominios remotos autorizados (Unsplash, Placehold y el bucket de almacenamiento de Supabase del proyecto).

---

## 14. `proxy.ts`

El archivo [`proxy.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/proxy.ts) se encuentra ubicado en la raíz del proyecto.

### Inspección del código real

```typescript
import { NextResponse } from 'next/server';

// Toda la aplicación es pública. No se requiere autenticación.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
```

- **Función**: Define una función middleware/proxy simplificada. En el estado actual del repositorio, la función simplemente retorna `NextResponse.next()`, lo que indica que toda la navegación de la plataforma es de acceso público y sin restricciones de autenticación.

---

## 15. Archivos de configuración adicionales

- **`eslint.config.mjs`**: Configuración plana de ESLint importando las reglas oficiales de Web Vitals y TypeScript de Next.js.
- **`postcss.config.mjs`**: Configuración del procesador CSS que habilita `@tailwindcss/postcss` para compilar los estilos de Tailwind v4.
- **`.gitignore`**: Especifica los archivos que Git debe ignorar (`node_modules`, `.next/`, `.env.local`, etc.).
- **`next-env.d.ts`**: Archivo de declaración de tipos generado por Next.js para reconocer variables de entorno y recursos estáticos.

---

## 16. `AGENTS.md` y `CLAUDE.md`

Tanto `AGENTS.md` como `CLAUDE.md` son archivos de contexto para **herramientas y asistentes de Inteligencia Artificial** (como Antigravity o Claude Code).

- **Función**: Proveen pautas especiales sobre versiones de librerías y reglas de desarrollo a los asistentes de código.
- **Importancia**: No forman parte del código fuente de la aplicación ni se incluyen en la compilación enviada al navegador en producción.

---

## 17. Archivos generados automáticamente

Existen tres elementos en el proyecto que se crean automáticamente y no deben editarse a mano:

1. **`node_modules/`**: Carpeta donde npm instala los paquetes de software. Ignorada en Git por su enorme tamaño.
2. **`.next/`**: Carpeta creada por `next dev` o `next build` con la compilación en memoria y caché de la aplicación.
3. **`tsconfig.tsbuildinfo`**: Archivo de caché utilizado por TypeScript para acelerar las compilaciones incrementales.

---

## 18. Flujo simplificado de ejecución del sistema

El siguiente esquema ilustra cómo interactúan los archivos cuando un usuario utiliza la plataforma:

```text
[Usuario en el Navegador]
           │
           ▼
[Ruta URL: /mapa] ───────────────► [app/mapa/page.tsx]
                                          │
                                          ▼
                                   [MapClient.tsx] (SSR: false)
                                          │
                                          ▼
                                    [MapView.tsx]
                                 ┌────────┴────────┐
                                 ▼                 ▼
                         [ReportMarker.tsx]  [FilterPanel.tsx]
                                 │                 │
                                 └────────┬────────┘
                                          ▼
                                  [src/lib/supabase.ts]
                                          │
                                          ▼
                              [Base de Datos Supabase]
```

---

## 19. Guía práctica: ¿Cómo encontrar una funcionalidad?

Para modificar o inspeccionar una función específica dentro del código fuente real:

- **Si quieres modificar la página de inicio**: Edita [`app/page.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/app/page.tsx).
- **Si quieres modificar la visualización del mapa**: Revisa [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx).
- **Si quieres ajustar los campos del formulario de reportes**: Revisa [`src/components/ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx).
- **Si quieres alterar la barra de navegación superior**: Modifica [`src/components/Navigation.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/Navigation.tsx).
- **Si necesitas verificar la conexión con Supabase**: Revisa [`src/lib/supabase.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/lib/supabase.ts) y `.env.local`.
- **Si deseas añadir un nuevo tipo de dato**: Edita las interfaces en [`src/types/report.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/types/report.ts).

---

## 20. Estado de organización del proyecto

Tras la inspección completa del código fuente, se realiza la siguiente evaluación descriptiva y objetiva:

### Estructura actual observada

1. **Separación limpia de responsabilidades**: La arquitectura separa adecuadamente el enrutamiento (`app/`), los componentes reutilizables (`src/components/`) y los tipos (`src/types/`).
2. **Coexistencia de `app/` y `src/`**: Las rutas residen en `app/` mientras que la lógica modular reside en `src/`, lo cual está correctamente vinculado mediante el alias `@/*`.
3. **Puntos a considerar para desarrollo futuro**:
   - La ruta `/test-db` es una vista de pruebas de desarrollo que no forma parte de la interfaz final de usuario.
   - La vista `/estaciones` contiene actualmente un maquetado estático preparado para la posterior integración de los sensores IoT.
   - La carpeta `scratch/` agrupa scripts administrativos en JS que podrían organizarse en una carpeta dedicada de herramientas (*tools*) a medida que el proyecto crezca.

---

## 21. Qué NO debemos modificar sin comprender

Antes de realizar modificaciones, se debe tener especial precaución con los siguientes archivos críticos:

- **`package.json` y `package-lock.json`**: Modificarlos sin cuidado puede romper las versiones de las librerías o impedir la compilación del proyecto.
- **`tsconfig.json`**: Alterar los alias de importación (`@/*`) o las opciones del compilador provocará errores de tipos en todos los archivos `.tsx`.
- **`next.config.ts`**: Si se eliminan los dominios de `remotePatterns`, las imágenes provenientes de Supabase o Unsplash no cargarán en la interfaz.
- **`src/lib/supabase.ts` y `.env.local`**: Modificar las variables de entorno interrumpirá la comunicación con la base de datos de producción.

---

## 22. Ayuda memoria

### Mapa rápido de ubicación en el proyecto

- **Raíz del proyecto**: `my-app/` (donde está `package.json`).
- **Páginas y rutas**: `app/` (`page.tsx`, `mapa/page.tsx`, `estaciones/page.tsx`).
- **Componentes React**: `src/components/` (`MapView.tsx`, `ReportForm.tsx`, etc.).
- **Conexión a Supabase**: `src/lib/supabase.ts`.
- **Tipos de TypeScript**: `src/types/report.ts`.
- **Recursos estáticos públicos**: `public/`.
- **Scripts de prueba**: `scratch/`.
- **Archivos autogenerados (NO editar)**: `node_modules/`, `.next/`, `tsconfig.tsbuildinfo`.

---

## 23. Resultado del capítulo

Al finalizar la lectura de este capítulo, cualquier estudiante, desarrollador o evaluador es capaz de:

1. Identificar de inmediato la estructura real de carpetas y archivos del repositorio.
2. Localizar exactamente la página, componente o archivo de configuración que necesita inspeccionar o modificar.
3. Comprender el flujo de datos entre las vistas de Next.js, los componentes de Leaflet y los servicios de Supabase.
4. Distinguir con claridad el código fuente del proyecto frente a los archivos temporales y generados automáticamente por el sistema.
