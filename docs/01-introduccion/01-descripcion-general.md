# Capítulo 01: Descripción General del Proyecto

Este documento constituye la introducción general y marco conceptual del proyecto de trabajo final de grado para la carrera de Ingeniería Mecatrónica (FIUNA). Presenta una visión integral del sistema, contextualizando la problemática de las inundaciones urbanas, los objetivos planteados, las fuentes de información contempladas, la arquitectura conceptual del flujo de datos, y una comparativa técnica transparente entre lo propuesto en la documentación académica y lo efectivamente implementado en el código fuente actual.

---

## 1. Descripción general del proyecto

El proyecto consiste en un **sistema integrado de monitoreo y visualización de inundaciones urbanas en el Área Metropolitana de Asunción (AMA)**.

Su propósito fundamental es abordar la falta de información hidrometeorológica centralizada y en tiempo real durante eventos de precipitaciones intensas. Para ello, combina herramientas de **ciencia ciudadana** (reportes generados por la población con ubicación y fotografías) y la visualización cartográfica digital en una plataforma web interactiva, contemplando además la futura integración de una **red de sensores basados en Internet de las Cosas (IoT)** instalados en la cuenca del arroyo Mburicaó.

---

## 2. Contexto y problemática

### El problema de las inundaciones urbanas en Asunción

En el Área Metropolitana de Asunción (AMA), las precipitaciones intensas generan de forma recurrente episodios severos de inundación y formación de raudales repentinos. Estos eventos afectan gravemente la movilidad urbana, causan daños materiales significativos en infraestructuras y vehículos, e imponen situaciones de elevado riesgo para la seguridad física de peatones y conductores.

### Factores condicionantes identificados

Según la información documentada en la propuesta de anteproyecto de grado:

1. **Deficiencia de infraestructura de drenaje**: Aproximadamente solo el **20% de la ciudad de Asunción dispone de cobertura de desagüe pluvial**, y gran parte de la infraestructura existente data de la década de 1970, lo que evidencia una capacidad sumamente limitada frente a lluvias de gran volumen.
2. **Distribución de puntos críticos**: Se han identificado más de **80 puntos críticos de acumulación de agua** repartidos en el AMA:
   - **Lambaré**: 31 puntos críticos.
   - **Mariano Roque Alonso**: 20 puntos críticos.
   - **Luque**: 15 puntos críticos.
   - **Asunción**: 11 puntos críticos.
   - **Fernando de la Mora**: 11 puntos críticos.
3. **Dispersión y falta de datos en tiempo real**: La información sobre el comportamiento de los arroyos y cauces durante lluvias intensas suele estar fragmentada, no disponible en tiempo real o inaccesible para la ciudadanía y las autoridades, lo que dificulta la toma de decisiones informadas y la alerta temprana.

---

## 3. Objetivo del sistema

Es necesario diferenciar el alcance académico del proyecto de tesis del alcance tecnológico de la plataforma desarrollada:

```
                          ┌─────────────────────────────────────────────────────────┐
                          │                 OBJETIVO GENERAL                        │
                          │   Monitoreo y visualización de inundaciones urbanas    │
                          └────────────────────────────┬────────────────────────────┘
                                                       │
                   ┌───────────────────────────────────┴───────────────────────────────────┐
                   ▼                                                                       ▼
┌───────────────────────────────────────┐                               ┌───────────────────────────────────────┐
│          Objetivo Académico           │                               │         Objetivo Tecnológico          │
│        (Tesis Mecatrónica)            │                               │        (Plataforma de Software)       │
├───────────────────────────────────────┤                               ├───────────────────────────────────────┤
│ • Diseñar e implementar una estación  │                               │ • Proveer un Dashboard Web interactivo│
│   de monitoreo IoT (nivel y lluvia).  │                               │   construido con Next.js + React.     │
│ • Evaluar la estación en la cuenca    │                               │ • Permitir el registro geolocalizado  │
│   piloto del arroyo Mburicaó.         │                               │   de reportes ciudadanos con foto.    │
│ • Analizar la correlación entre       │                               │ • Almacenar y gestionar datos en      │
│   mediciones físicas y reportes.      │                               │   Supabase (PostgreSQL + Storage).    │
│ • Redactar y defender el Libro TFG.   │                               │ • Renderizar mapas con Leaflet, filtros│
│                                       │                               │   por gravedad y capas de calor.      │
└───────────────────────────────────────┘                               └───────────────────────────────────────┘
```

---

## 4. Fuentes de información del sistema

El proyecto concibe la adquisición de información mediante múltiples fuentes complementarias. A continuación, se detalla el estado real de cada fuente al inspeccionar el código fuente del repositorio:

| Fuente de Información | Descripción | Estado de Implementación | Justificación en el Código |
| :--- | :--- | :--- | :--- |
| **Reportes Ciudadanos** | Registro directo por usuarios con coordenadas, descripción, etiquetas de afectación y fotos. | **Implementado** | Componentes `ReportForm.tsx`, `SidebarReports.tsx` e integración con la tabla `reportes` en Supabase. |
| **Imágenes / Evidencia** | Subida de fotografías como evidencia visual asociada a los reportes. | **Implementado** | Validación y almacenamiento en Supabase Storage (bucket `reportes/imagenes/`) desde `ReportForm.tsx`. |
| **Noticias Históricas** | Registro cartográfico de eventos pasados reportados en medios periodísticos. | **Implementado** | Consulta a la tabla `noticias_historicas` en Supabase y renderizado de marcadores informativos mediante `NewsMarker.tsx`. |
| **Estaciones y Sensores IoT** | Mediciones telemétricas de nivel de agua y precipitación (pluviómetro). | **En desarrollo / Maquetado** | Existe la ruta `app/estaciones/page.tsx` con la interfaz preparada ("Próxima Integración"), pero deshabilitada de la base de datos en tiempo real. |
| **Web Scraping** | Extracción automática de noticias o datos de portales públicos digitales. | **Planificado** | Mencionado como trabajo futuro en la propuesta ERMAC; no existen scripts ni microservicios de scraping en el repositorio. |
| **Modelos de IA / Predicción** | Algoritmos predictivos de inundación o procesamiento inteligente de imágenes. | **Planificado / Excluido de TFG** | Expresamente excluido del alcance del anteproyecto original y sin código en el repositorio actual. |

---

## 5. Funcionamiento conceptual

El flujo general de información del sistema sigue un modelo clásico de adquisición, almacenamiento, procesamiento y visualización geográfica:

```
┌────────────────────────┐      ┌────────────────────────┐
│  Reportes Ciudadanos   │      │  Noticias Históricas   │
│  (Formulario Web + Foto)│      │  (Registros Supabase)  │
└───────────┬────────────┘      └───────────┬────────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
           ┌────────────────────────────────┐
           │      Gestión e Inserción       │
           │  • Supabase Database (Postgres)│
           │  • Supabase Storage (Imágenes) │
           └────────────────┬───────────────┘
                            ▼
           ┌────────────────────────────────┐
           │      Procesamiento Local       │
           │  • Filtrado por estado/fecha   │
           │  • Cálculo de densidad/heatmap │
           └────────────────┬───────────────┘
                            ▼
           ┌────────────────────────────────┐
           │    Visualización e Interfaz    │
           │  • MapView (Leaflet + Tiles)   │
           │  • Sidebar & Paneles de Filtro │
           └────────────────────────────────┘
```

1. **Adquisición**: El usuario interactúa con el formulario en la web (`ReportForm`), selecciona un punto en el mapa interactivo, adjunta una imagen y selecciona etiquetas de impacto.
2. **Almacenamiento**: La imagen se sube a Supabase Storage y los metadatos (coordenadas, descripción, URL de la imagen, estado `"pendiente"`) se persisten en PostgreSQL.
3. **Procesamiento y Filtrado**: La aplicación web (`MapView`) consume los registros, aplica filtros por gravedad/afectaciones e hiper-localiza los eventos generando puntos de calor (*heatmap*).
4. **Visualización**: El usuario final explora la cartografía dinámica con capas de mapa base (Voyager, Light, Satelital) y paneles laterales detallados.

---

## 6. Componentes principales del sistema

Al inspeccionar el código fuente del proyecto, se comprueba la existencia de los siguientes módulos principales:

- **Frontend App**: Desarrollado en **Next.js (App Router)** con **TypeScript** y estilizado con **Tailwind CSS**.
- **Módulo de Mapa Interactivo**: Implementado mediante **Leaflet** y **React-Leaflet** en el componente `MapView.tsx`. Incluye marcadores personalizados (`ReportMarker.tsx`, `NewsMarker.tsx`) y mapas base interactivos.
- **Formulario de Registro**: Componente `ReportForm.tsx` con geolocalización por clic en el mapa y validación de tipos de archivo (imágenes JPG, PNG, WebP de hasta 5 MB).
- **Panel de Filtros y Navegación**: `FilterPanel.tsx` y `SidebarReports.tsx` para la selección de fechas, estado de validación, tipos de afectación y capas.
- **Base de Datos y Almacenamiento**: Integración con **Supabase PostgreSQL** (tablas `reportes` y `noticias_historicas`) y **Supabase Storage** configurado en `src/lib/supabase.ts`.

---

## 7. Estado actual del desarrollo

Para mantener total transparencia académica entre el marco teórico planteado en los documentos y la realidad del software, se clasifica el estado actual del repositorio:

### Implementado
- Plataforma web responsive completa con Next.js y React.
- Mapeo interactivo dinámico con Leaflet (soporte para 3 capas base: Voyager, Light y Satelital Esri).
- Sistema completo de reportes ciudadanos en tiempo real (inserción en base de datos PostgreSQL de Supabase).
- Módulo de subida de imágenes con validación de tipo/tamaño y almacenamiento remoto en Supabase Storage.
- Módulo de visualización de Noticias Históricas cargadas en el mapa.
- Sistema de filtros multicriterio (por estado de validación, rango de fecha, etiquetas de impacto y mapas de densidad/calor).

### En desarrollo o parcialmente implementado
- **Módulo de Estaciones Hidrometeorológicas**: La vista `app/estaciones` está estructurada visualmente con selectores e indicadores ("Próxima Integración"), pero utiliza controles deshabilitados y no está conectada aún a una tabla de datos o API de sensores en tiempo real.

### Planificado
- **Estación de Monitoreo Hardware IoT**: Construcción física de la estación con microcontrolador, sensor ultrasónico/radar de nivel de agua, pluviómetro y transmisión remota.
- **Despliegue y validación en la cuenca del arroyo Mburicaó**: Instalación física del nodo piloto en el punto seleccionado dentro de la cuenca.
- **Web Scraping y recolección automatizada**: Scripts automáticos para la lectura continua de noticias de inundación.
- **Modelos de predicción o Análisis con IA**: Análisis avanzado de patrones mediante Inteligencia Artificial (expresamente fuera del alcance de la etapa inicial).

---

## 8. Evolución del proyecto

La trayectoria del proyecto evidencia una progresión constante desde la formulación académica teórica hasta la puesta en marcha de un sistema de software funcional:

1. **Fase 1: Anteproyecto de Grado (FIUNA)**
   - Se estableció la formulación académica inicial, identificando los 80+ puntos críticos en el AMA y proponiendo una arquitectura mixta (Hardware IoT en el arroyo Mburicaó + Plataforma Web + Reportes Ciudadanos).
2. **Fase 2: Presentación ERMAC 2026**
   - El trabajo se centró en validar la factibilidad del enfoque de **ciencia ciudadana**, concretando la pila tecnológica de la plataforma web (Next.js, React, Supabase, Leaflet, Supabase Storage) y presentando los primeros resultados del mapa interactivo con reportes geolocalizados.
3. **Fase 3: Estado Actual del Código**
   - Se consolidó la plataforma web. Se cuenta con un sistema operativo de captura y filtrado de reportes e imágenes en la nube, habiendo dejado preparada la interfaz de software para integrar la red de estaciones IoT cuando el hardware sea desplegado.

---

## 9. Relación entre los componentes

La interacción entre componentes del sistema operativo se resume en la siguiente secuencia de integración:

```
[Usuario / Ciudadano]
        │
        ├───> Envía reporte / foto ──────> [ReportForm.tsx]
        │                                       │
        │                                       ▼
        │                              [Supabase Service]
        │                              ├── PostgreSQL: tabla `reportes`
        │                              └── Storage: bucket `imagenes`
        │                                       │
        │                                       ▼
        │                                 [MapView.tsx]
        │                                       │
        └───> Explora mapa y filtros <──────────┴────────> [Leaflet Canvas / Markers / Heatmap]
```

---

## 10. Resumen para estudio

## Ayuda memoria

- **¿Qué problema resuelve?**: Resuelve la falta de información centralizada y en tiempo real sobre inundaciones y raudales urbanos en el Área Metropolitana de Asunción (AMA), caracterizada por contar con solo un 20% de cobertura de desagüe pluvial y más de 80 puntos críticos de inundación.
- **¿Qué hace la plataforma?**: Es una aplicación web interactiva que permite a los ciudadanos reportar eventos de acumulación de agua con ubicación e imágenes, y a los usuarios/investigadores visualizar e inspeccionar incidentes y noticias históricas sobre un mapa dinámico.
- **¿Qué información utiliza?**: Reportes ciudadanos en tiempo real, fotografías adjuntas como evidencia, noticias históricas geolocalizadas y (en el futuro) datos telemétricos de estaciones IoT.
- **¿Cómo funciona de manera general?**: Los reportes se capturan desde la web en Next.js, se envían a Supabase (PostgreSQL para datos relacionales y Storage para imágenes) y se procesan en el cliente para renderizar marcadores, mapas de calor y filtros en Leaflet.
- **¿Qué se encuentra actualmente implementado?**: Está 100% implementada la plataforma web frontend, la gestión de mapas, los filtros multicriterio, la carga/almacenamiento de reportes e imágenes en Supabase y el marcador de noticias históricas. Se encuentra maquetada la interfaz de estaciones de monitoreo a la espera del despliegue del hardware IoT.
