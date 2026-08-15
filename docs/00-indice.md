# Índice General de Documentación - Proyecto de Tesis

Este documento sirve como página principal e índice general para la navegación completa de la documentación del proyecto de tesis. Está diseñado tanto para permitir a un desarrollador o evaluador reproducir la plataforma desde cero, como para servir de guía de estudio técnico y defensa académica del sistema.

---

# PARTE I · CONSTRUCCIÓN DE LA PLATAFORMA WEB

### [01 · Introducción y descripción del proyecto](01-introduccion/01-descripcion-general.md)
Descripción del problema social e hidrometeorológico que aborda la plataforma, sus objetivos generales y específicos, alcance funcional y la arquitectura general planteada.

### [02 · Preparación del entorno](02-preparacion-entorno/01-preparacion-entorno.md)
Instalación y preparación de herramientas necesarias (Node.js, npm, Git, editor de código Antigravity/VS Code y terminal).

### [03 · Creación del proyecto Next.js](03-creacion-nextjs/01-crear-proyecto-nextjs.md)
Creación de la aplicación desde cero con Next.js 16 (App Router), TypeScript, Tailwind CSS y primeros comandos de ejecución.

### [04 · Estructura del proyecto](04-estructura-proyecto/01-estructura-y-arquitectura.md)
Organización de carpetas, archivos, convenciones del App Router, Server/Client Components y arquitectura básica del frontend.

### [05 · Git y GitHub](05-git-github/01-git-github-desde-cero.md)
Control de versiones, flujo de trabajo con ramas (`main`), convenciones de commits, vinculación con el repositorio remoto en GitHub y sincronización.

### [06 · Supabase](06-supabase/01-supabase-y-conexion.md)
Configuración del backend como servicio (BaaS) en Supabase Cloud, creación de credenciales y conexión segura con el cliente frontend de la aplicación.

### [07 · Base de datos](07-base-datos/01-estructura-base-datos.md)
Tablas relacionales (`reportes_ciudadanos`, `noticias`), tipos de datos, PostGIS/coordenadas, políticas de seguridad RLS y Supabase Storage para imágenes.

### [08 · Mapa interactivo y Leaflet](08-mapa-leaflet/01-mapa-interactivo-leaflet.md)
Integración del mapa interactivo mediante Leaflet y React Leaflet, manejo de coordenadas, capas base, marcadores personalizados, popups e integración de datos.

### [09 · Reportes ciudadanos](09-reportes-ciudadanos/01-reportes-ciudadanos-y-carga-imagenes.md)
Formulario de captura, ubicación interactiva, selección de tipo de afectación, subida de fotografías adjuntas a Supabase Storage y almacenamiento en base de datos.

### [10 · Noticias históricas](10-noticias-historicas/01-noticias-historicas.md)
Estructura de datos, georreferenciación de noticias de periódicos/portales, panel lateral de detalles y visualización geoespacial de eventos históricos.

### [11 · Filtros, sidebar e interacción](11-filtros-interfaz/01-filtros-sidebar-interaccion.md)
Controles de interfaz de usuario, gestión de estados globales y locales en React, panel lateral interactivo y filtrado dinámico por fecha, categoría y tipo de evento.

### [12 · Despliegue con Vercel](12-vercel/01-despliegue-vercel.md)
Publicación de la aplicación en la nube, configuración de variables de entorno de producción y relación de integración continua entre GitHub, Vercel y Supabase.

---

# Ruta de aprendizaje recomendada

Para reconstruir y comprender la plataforma desde cero se recomienda seguir el siguiente flujo secuencial:

```text
Fundamentos (01-02)
       ↓
Next.js (03-04)
       ↓
Git / GitHub (05)
       ↓
Supabase (06)
       ↓
Base de datos (07)
       ↓
Leaflet (08)
       ↓
Reportes (09)
       ↓
Noticias (10)
       ↓
Filtros (11)
       ↓
Deployment (12)
```

**¿Por qué este orden?**
1. **Fundamentos y Entorno (01–05):** Permiten dejar lista la estación de trabajo, inicializar el framework Next.js con su arquitectura de componentes y asegurar el control de versiones con Git/GitHub.
2. **Backend y Datos (06–07):** Establecen la infraestructura de almacenamiento remoto (Supabase PostgreSQL y Storage) antes de consumir datos en la interfaz.
3. **Módulos de Interfaz y Lógica (08–11):** Integran el mapa base con Leaflet y construyen los componentes interactivos de carga (reportes), consulta (noticias) y filtrado dinámico.
4. **Despliegue (12):** Publica la plataforma terminada en Internet conectando el repositorio de GitHub con Vercel y las variables de entorno de Supabase.

---

# Ayuda memoria general

| Tecnología | ¿Para qué la usamos? |
| :--- | :--- |
| **HTML / CSS** | Estructura semántica de páginas y estilos visuales. |
| **JavaScript / TypeScript** | Lógica de la aplicación con tipado estático seguro. |
| **React 19** | Biblioteca para construir la interfaz basada en componentes. |
| **Next.js 16** | Framework principal (App Router, Server Components y optimización). |
| **Leaflet** | Biblioteca JavaScript para renderizado de mapas interactivos 2D. |
| **React Leaflet** | Integración y abstracción de componentes Leaflet para React. |
| **Supabase** | Backend de servicios (Autenticación, API REST y base de datos). |
| **PostgreSQL** | Motor de base de datos relacional para guardar noticias y reportes. |
| **Supabase Storage** | Almacenamiento de objetos en la nube para archivos e imágenes. |
| **Git** | Sistema de control de versiones local. |
| **GitHub** | Repositorio remoto centralizado en la nube. |
| **Vercel** | Plataforma de alojamiento, compilación y despliegue continuo (*Deployment*). |

---

# FLUJO GENERAL DE LA PLATAFORMA

```text
USUARIO
   ↓
NEXT.JS / REACT (App Router + Tailwind CSS)
   ↓
MAPA + FORMULARIOS (React Leaflet / UI Components)
   ↓
SUPABASE
├── PostgreSQL (Tablas: reportes_ciudadanos, noticias)
└── Storage (Bucket: reportes-imagenes)
   ↓
DATOS (API REST / Supabase Client)
   ↓
LEAFLET (Renderizado de marcadores y capas)
   ↓
VISUALIZACIÓN (Sidebar, Popups y Filtros)
```

---

# ¿DÓNDE BUSCAR?

| Quiero recordar... | Capítulo |
| :--- | :---: |
| Cómo instalar todo y configurar el entorno | [02](02-preparacion-entorno/01-preparacion-entorno.md) |
| Cómo crear Next.js y sus comandos principales | [03](03-creacion-nextjs/01-crear-proyecto-nextjs.md) |
| Cómo está organizado el proyecto y sus carpetas | [04](04-estructura-proyecto/01-estructura-y-arquitectura.md) |
| Cómo usar Git y GitHub paso a paso | [05](05-git-github/01-git-github-desde-cero.md) |
| Cómo conectar Supabase con la aplicación | [06](06-supabase/01-supabase-y-conexion.md) |
| Cómo funciona la base de datos y sus tablas | [07](07-base-datos/01-estructura-base-datos.md) |
| Cómo funciona el mapa interactivo y Leaflet | [08](08-mapa-leaflet/01-mapa-interactivo-leaflet.md) |
| Cómo funcionan los reportes y subida de imágenes | [09](09-reportes-ciudadanos/01-reportes-ciudadanos-y-carga-imagenes.md) |
| Cómo funcionan las noticias históricas | [10](10-noticias-historicas/01-noticias-historicas.md) |
| Cómo funcionan los filtros e interfaz lateral | [11](11-filtros-interfaz/01-filtros-sidebar-interaccion.md) |
| Cómo publicar la página en Internet con Vercel | [12](12-vercel/01-despliegue-vercel.md) |

---

# PARTE II · ADQUISICIÓN Y PROCESAMIENTO DE DATOS

> **Estado:** `Planificado / En desarrollo`

Hoja de ruta para los módulos de extracción y preparación automatizada de información:

* **13 · Web scraping desde cero:** Fundamentos y arquitectura de scraping para fuentes meteorológicas y medios digitales.
* **14 · Recolección automática de noticias:** Scripts cron/programados para la extracción continua de artículos e incidencias.
* **15 · Limpieza y preparación de datos:** Normalización de texto, eliminación de duplicados y estructuración de datos no estructurados.
* **16 · Georreferenciación de noticias:** Extracción de entidades de lugar (NER/Geocoding) para asignar coordenadas a noticias de texto.
* **17 · Clasificación de eventos:** Categorización automática de nivel de severidad, tipo de inundación y zona afectada.

---

# PARTE III · ANÁLISIS E INTELIGENCIA ARTIFICIAL

> **Estado:** `Planificado`

Hoja de ruta para el desarrollo de algoritmos inteligentes y análisis avanzado:

* **18 · Análisis espacial y temporal:** Detección de patrones de recurrencia y mapas de calor históricos.
* **19 · Indicadores y niveles de riesgo:** Algoritmos de ponderación para calcular el riesgo por sector o cuenca.
* **20 · IA para análisis de imágenes:** Modelos de visión por computadora para detectar acumulación de agua o inundaciones en fotos.
* **21 · Validación de imágenes ciudadanas:** Filtros automáticos contra imágenes falsas o fuera de contexto.
* **22 · Modelos de riesgo/predicción:** Modelado predictivo basado en datos históricos, lluvias y reportes en tiempo real.

---

# PARTE IV · ESTACIONES IoT

> **Estado:** `En desarrollo / Integración futura con la plataforma`

Hoja de ruta para la red física de sensores meteorológicos e hidrométricos:

* **23 · Arquitectura de la estación hidrometeorológica:** Diseño de hardware, fuente de alimentación y gabinete intemperie.
* **24 · ESP32 y ESP-IDF:** Programación del microcontrolador principal y gestión de tareas en tiempo real.
* **25 · RTC DS3231:** Módulo de reloj en tiempo real para estampas de tiempo de alta precisión en almacenamiento offline.
* **26 · MicroSD:** Registro local de datos (*datalogging*) como respaldo ante fallos de conectividad.
* **27 · RS485 y sensores:** Protocolos industriales para la lectura de sensores de nivel de agua y pluviómetros.
* **28 · Comunicación con la plataforma:** Envío de telemetría a la API/Supabase mediante WiFi/GSM/LoRa.

---

# PARTE V · INTEGRACIÓN Y VALIDACIÓN

> **Estado:** `Planificado`

Hoja de ruta para la consolidación del ecosistema completo de la tesis:

* **29 · Integración de sensores, noticias y reportes ciudadanos:** Unificación de los 3 ejes de captura en un único mapa de situación.
* **30 · Arquitectura final del sistema:** Diagrama integral end-to-end de hardware, backend, IA y frontend.
* **31 · Pruebas y validación:** Protocolos de pruebas de rendimiento, usabilidad en campo y tolerancia a fallos.
* **32 · Resultados:** Conclusiones, evaluación de impacto de la plataforma y trabajo futuro.
