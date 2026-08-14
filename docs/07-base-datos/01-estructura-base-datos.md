# Capítulo 07 · Base de datos y estructura de la información

## 1. Introducción y contextualización

Este capítulo documenta la estructura de datos **REAL** utilizada actualmente por la plataforma web de monitoreo de inundaciones en el Área Metropolitana de Asunción. La información presentada surge de la combinación entre el análisis técnico del código fuente TypeScript/JavaScript de la aplicación (`my-app`) y la **verificación manual directa efectuada en el panel de administración de Supabase**.

> [!IMPORTANT]
> **Aviso de rigor metodológico y niveles de confirmación:**
> En este capítulo se establece una distinción clara y permanente entre tres niveles de información:
> 1. **Información confirmada directamente en Supabase**: Tablas existentes (`reportes`, `noticias_historicas`), tipos de datos nativos de PostgreSQL (`uuid`, `float8`, `text`, `_text`, `timestamptz`, `date`), claves primarias, nulabilidad, volumen actual de registros (0 en `reportes`, 32 en `noticias_historicas`), buckets de Storage (`REPORTES`, `NOTICIAS_HISTORICAS`) y políticas de acceso verificadas.
> 2. **Información comprobada mediante el código**: Consultas de lectura (`SELECT`), inserción (`INSERT`), componentes React que consumen los campos y flujos de renderizado cartográfico.
> 3. **Información pendiente de verificación**: Expresiones SQL de valores predeterminados (`DEFAULT`), restricciones de servidor DDL no visibles y reglas exactas de políticas de tabla o Triggers.

---

## 2. Objetivo del capítulo

El objetivo fundamental de este capítulo es explicar cómo la base de datos almacena, organiza y provee información estructurada para alimentar la visualización geográfica, la geocodificación y los filtros interactivos del mapa.

A lo largo del documento se responde formalmente a las siguientes interrogantes:
* **¿Qué información almacena el sistema?**: Reportes urbanos generados por la ciudadanía y recopilaciones de noticias históricas sobre inundaciones y anegamientos.
* **¿Cómo está organizada la información?**: En tablas relacionales hospedadas en PostgreSQL dentro de Supabase y buckets de almacenamiento de archivos multimedia (Storage).
* **¿Qué tablas utiliza la aplicación activa?**: La tabla `reportes` (infraestructura preparada, 0 registros al momento de esta documentación) y la tabla `noticias_historicas` (32 registros observados).
* **¿Qué representa cada campo?**: Atributos descriptivos (`text`), espaciales (`float8` para coordenadas geográficas), temporales (`timestamptz` y `date`), multimedia (`imagen_url`) y categorizaciones de afectaciones (`_text`).
* **¿Qué componentes consumen esos datos?**: La vista de mapa principal ([`MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx)), el formulario de reporte ([`ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx)), los marcadores ([`ReportMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportMarker.tsx), [`NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx)), la lista lateral ([`SidebarReports.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SidebarReports.tsx)) y la capa de mapa de calor ([`HeatmapLayer.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/HeatmapLayer.tsx)).

---

## 3. ¿Qué es una base de datos?

Una **base de datos** es un sistema organizado para almacenar, gestionar y recuperar información digital de forma estructurada, rápida y segura.

Para comprender la arquitectura del proyecto, se definen los conceptos centrales desde cero aplicados a la plataforma:

* **Base de datos**: El contenedor principal que resguarda toda la información estructurada del proyecto (ej: la base de datos del proyecto de tesis hospedada en Supabase).
* **Tabla**: Estructura bidimensional en filas y columnas dedicada a una entidad específica (ej: la tabla `reportes` o `noticias_historicas`).
* **Fila o Registro**: Una entrada individual dentro de una tabla (ej: una nota periodística sobre el desborde del arroyo Mburicaó o una denuncia ciudadana sobre una calle anegada).
* **Columna o Campo**: Una característica o atributo específico guardado en cada registro (ej: `latitud`, `longitud`, `descripcion`, `fuente`).
* **Tipo de dato**: La naturaleza de la información que puede alojar una columna (ej: `text` para frases, `float8` para números decimales de coordenadas, `timestamptz` para fechas exactas).
* **Identificador (ID)**: Código único asignado a cada fila para diferenciarla unívocamente de las demás. En ambas tablas se confirmó el uso del tipo `uuid`.

---

## 4. PostgreSQL y Supabase

En la arquitectura de la plataforma, se diferencia claramente entre la plataforma backend administrada y el motor de base de datos relacional:

```text
┌─────────────────────────────────────────────────────────────┐
│                          SUPABASE                           │
│ (Plataforma Backend Backend-as-a-Service / API PostgREST)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         POSTGRESQL                          │
│        (Motor de Base de Datos Relacional / SQL)            │
└──────────────────────────────┴──────────────────────────────┘
```

* **Supabase**: Es el servicio de infraestructura (BaaS) que provee la API REST autogenerada (vía PostgREST), autenticación, cliente SDK en TypeScript (`@supabase/supabase-js`) y almacenamiento de archivos binarios (Storage).
* **PostgreSQL**: Es el motor de base de datos relacional de código abierto que funciona bajo Supabase. Se encarga de la ejecución física de consultas SQL, tablas, índices, tipos de datos y persistencia en disco.

**Importancia en la arquitectura**: El código ejecutable en Next.js no escribe consultas SQL crudas (`SELECT * FROM reportes`), sino que invoca métodos del cliente de Supabase (`supabase.from('reportes').select('*')`), el cual convierte las llamadas a peticiones HTTP seguras enviadas a PostgreSQL.

---

## 5. Modelo conceptual de información

La información administrada por el sistema se divide en las siguientes categorías comprobadas:

1. **Reportes ciudadanos (`reportes`)**: Estructura diseñada para recibir notificaciones dinámicas de los ciudadanos sobre acumulación de agua, desbordes o daños en infraestructura.
2. **Noticias históricas (`noticias_historicas`)**: Recopilación estructurada de eventos pasados de inundación documentados por medios de prensa para análisis comparativo y temporal.
3. **Información geográfica**: Coordenadas espaciales de doble precisión (`latitud` y `longitud` de tipo `float8`) requeridas para posicionar los datos sobre el mapa interactivo.
4. **Archivos multimedia**: Fotografías guardadas en los buckets públicos de Supabase Storage (`REPORTES` y `NOTICIAS_HISTORICAS`) cuyos enlaces se almacenan en la columna `imagen_url`.
5. **Estados y categorizaciones**: Clasificación de verificación (`pendiente`, `validado`, `rechazado`), etiquetas múltiples de daños (`afectaciones`: `_text`), gravedad (`moderada`, `severa`) y tipos de evento (`inundacion_fluvial`, `anegamiento`, etc.).

```text
                    ┌─────────────────────────┐
                    │ MODELO DE INFORMACIÓN   │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌─────────────────────────────────┐             ┌─────────────────────────────────┐
│       REPORTES CIUDADANOS       │             │       NOTICIAS HISTÓRICAS       │
├─────────────────────────────────┤             ├─────────────────────────────────┤
│ • Identificador (id: uuid)      │             │ • Identificador (id: uuid)      │
│ • Ubicación (lat, lng: float8)  │             │ • Ubicación (lat, lng: float8)  │
│ • Descripción (text)            │             │ • Título y Descripción (text)   │
│ • Afectaciones (afectaciones:   │             │ • Fuente y URL externa (text)   │
│   _text / array de text)        │             │ • Ubicación en texto (text)     │
│ • Estado de verificación (text) │             │ • Tipo evento y Gravedad (text) │
│ • Evidencia fotográfica (text)  │             │ • Fecha publicación (date)      │
│ • Marca temporal (timestamptz)  │             │ • Marca temporal (timestamptz)  │
└─────────────────────────────────┘             └─────────────────────────────────┘
```

---

## 6. Inventario REAL de tablas y datos

Mediante la inspección estática del código fuente y la verificación manual en el panel de administración de Supabase, se establece el siguiente inventario de tablas reales:

### Tablas confirmadas en Supabase y utilizadas en la aplicación

| Tabla detectada | Nivel de confirmación | Volumen actual de registros | Operación en código | Archivos involucrados |
| :--- | :--- | :--- | :--- | :--- |
| `reportes` | Confirmado en Supabase | **0 registros** (Sin registros actualmente) | `SELECT`, `INSERT` | [`ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx), [`MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx) |
| `noticias_historicas` | Confirmado en Supabase | **32 registros** (Fotografía al momento de la inspección) | `SELECT` | [`MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx), [`check_news_coords.js`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/scratch/check_news_coords.js) |

### Tablas mencionadas en documentación previa pero NO existentes ni en código ni en Supabase
* `estaciones` / `mediciones`: Mencionadas conceptualmente en proyectos de monitoreo ambiental, pero **no existen en la base de datos de Supabase ni en el código ejecutable de la aplicación activa**.

---

## 7. Tabla de reportes ciudadanos (`reportes`)

### Finalidad
La tabla `reportes` almacena las denuncias e incidencias de anegamiento urbano enviadas participativamente por los usuarios a través del formulario web.

### Estructura confirmada en el panel de Supabase

| Campo | Tipo PostgreSQL confirmado | Restricción observada | Función en la aplicación | Evidencia en código |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key | Identificador único global del reporte | [`ReportForm.tsx:229`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L229), [`MapView.tsx:147`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L147) |
| `descripcion` | `text` | Nullable | Comentario detallado sobre el incidente | [`ReportForm.tsx:211`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L211), [`MapView.tsx:150`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L150) |
| `latitud` | `float8` | No aparece como nullable | Coordenada geográfica de latitud | [`ReportForm.tsx:212`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L212), [`MapView.tsx:148`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L148) |
| `longitud` | `float8` | No aparece como nullable | Coordenada geográfica de longitud | [`ReportForm.tsx:213`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L213), [`MapView.tsx:149`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L149) |
| `imagen_url` | `text` | Nullable | URL pública de la foto guardada en Storage | [`ReportForm.tsx:214`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L214), [`MapView.tsx:153`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L153) |
| `estado` | `text` | No aparece como nullable | Estado de validación (`"pendiente"`, `"validado"`, `"rechazado"`) | [`ReportForm.tsx:216`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L216), [`MapView.tsx:154`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L154) |
| `creado_en` | `timestamptz` | No aparece como nullable | Marca de tiempo exacta de la creación | [`MapView.tsx:134`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L134), [`ReportForm.tsx:234`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L234) |
| `afectaciones` | `_text` | Nullable | Matriz o array de etiquetas de texto (`string[]`) | [`ReportForm.tsx:217`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L217), [`MapView.tsx:151`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L151) |
| `archivo_tipo` | `text` | Nullable | Tipo del archivo adjunto (`"imagen"`) | [`ReportForm.tsx:215`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L215), [`MapView.tsx:155`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L155) |

> [!IMPORTANT]
> **Aclaración sobre el tipo `_text` en PostgreSQL:**
> El prefijo de guion bajo `_text` en PostgreSQL indica que la columna es una **matriz de texto (`text[]`)**. Esto confirma que la columna `afectaciones` no guarda una simple cadena fija, sino una lista de múltiples etiquetas seleccionables por el usuario (ej: `["Calle inundada", "Interrupción de tránsito"]`).

### Estado actual de `reportes`: Infraestructura vs. Registros
* **Infraestructura implementada**: La tabla existe en Supabase, el esquema de columnas está verificado, el bucket de Storage `REPORTES` está configurado y el código frontend posee las funciones completas de inserción y lectura.
* **Datos disponibles**: Al momento de esta documentación, la tabla `reportes` **no contiene registros (0 registros)** en producción.

---

## 8. Coordenadas geográficas

Tanto `reportes` como `noticias_historicas` utilizan dos columnas numéricas de doble precisión de tipo **`float8`**:

* **`latitud`** (`float8`): Expresa la posición en el eje norte-sur en grados decimales (aprox. `-25.2855` para Asunción).
* **`longitud`** (`float8`): Expresa la posición en el eje este-oeste en grados decimales (aprox. `-57.6150` para Asunción).

### Integración con Leaflet:
El motor cartográfico Leaflet requiere recibir un par ordenado de números `[latitud, longitud]` para instanciar los componentes `<Marker>` en la pantalla del usuario:

```text
  Base de Datos Supabase (PostgreSQL - float8)
            │
            ▼  (Consulta SELECT)
  Cliente JavaScript / TypeScript (MapView.tsx)
    lat: Number(dbReport.latitud)
    lng: Number(dbReport.longitud)
            │
            ▼  (Componente React Leaflet)
  <ReportMarker position={[lat, lng]} />
            │
            ▼
  Representación gráfica del punto sobre el lienzo del Mapa
```

---

## 9. Campo de Afectaciones (`afectaciones`)

El campo **`afectaciones`** (`_text` / array de textos en PostgreSQL) se utiliza para catalogar los daños observados.

### Valores predefinidos comprobados en la interfaz ([`ReportForm.tsx:9-20`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L9-L20)):
* `"Calle inundada"`
* `"Deslizamiento"`
* `"Árbol caído"`
* `"Vivienda afectada"`
* `"Vehículo afectado"`
* `"Persona atrapada"`
* `"Fallecimiento reportado"`
* `"Interrupción de tránsito"`
* `"Servicio público afectado"`
* `"Sin daños visibles"`

En JavaScript, estas opciones se gestionan como un arreglo `impactTags: string[]` que se envía directamente a Supabase al momento de insertar el reporte.

---

## 10. Estado del reporte (`estado`)

La columna **`estado`** (`text`) gestiona el flujo de moderación de las incidencias enviadas.

### Valores comprobados en el código:
1. **`"pendiente"`**: Asignado automáticamente desde el cliente web al registrar un reporte ([`ReportForm.tsx:216`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L216)).
2. **`"validado"`**: Opción de filtro en el mapa para mostrar incidentes verificados ([`MapView.tsx:44`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L44)).
3. **`"rechazado"`**: Opción de filtro para descartar denuncias falsas o duplicadas ([`MapView.tsx:44`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L44)).

---

## 11. Fecha y hora (Diferencia conceptual entre columnas)

Es crítico diferenciar las dos columnas temporales presentes en el sistema:

1. **`fecha_publicacion`** (`date` en `noticias_historicas`): Almacena la **fecha histórica original en la que ocurrió el evento o fue redactada la noticia periodística** (ej: `"1998-04-12"`, `"2014-06-05"`, `"2024-11-15"`). No almacena horas ni zona horaria.
2. **`creado_en`** (`timestamptz` en ambas tablas): Almacena la **marca de tiempo exacta (fecha, hora, minutos, segundos y zona horaria)** en la que la fila fue creada físicamente en el servidor de Supabase.

---

## 12. Tabla de noticias (`noticias_historicas`)

### Finalidad
Almacena un catálogo estructurado de eventos de inundación pasados recopilados desde medios masivos de comunicación y fuentes secundarias.

### Estructura confirmada en Supabase y datos existentes

| Campo | Tipo PostgreSQL confirmado | Restricción observada | Función en la aplicación | Ejemplo / Valores observados en Supabase |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key | Identificador único de la noticia | Generado automáticamente de tipo UUID |
| `fecha_publicacion` | `date` | Nullable | Fecha histórica del suceso periodístico | Años observados: 1998, 2002, 2004, 2005, 2006, 2009, 2013, 2014, 2019, 2020, 2022, 2024, 2025, 2026 |
| `titulo` | `text` | Nullable | Titular periodístico | Encabezado descriptivo de la noticia |
| `descripcion` | `text` | Nullable | Resumen o cuerpo del artículo | Resumen de los daños y zonas afectadas |
| `fuente` | `text` | Nullable | Medio periodístico u organismo emisor | Medios de comunicación u organismos oficiales |
| `url` | `text` | Nullable | Enlace web a la noticia original | Enlace web o `NULL` si no dispone de link |
| `ubicacion_texto` | `text` | Nullable | Descripción textual de la zona | Nombre del barrio o sector (ej. "Barrio San Pablo") |
| `latitud` | `float8` | Nullable | Coordenada de latitud | Posicionamiento numérico en mapa (ej. `-25.3120`) |
| `longitud` | `float8` | Nullable | Coordenada de longitud | Posicionamiento numérico en mapa (ej. `-57.5980`) |
| `tipo_evento` | `text` | Nullable | Categoría temática de la incidencia | Valores observados: `inundacion_fluvial`, `daños_infraestructura`, `anegamiento` (o `NULL`) |
| `gravedad` | `text` | Nullable | Nivel de severidad asignado | Valores observados: `moderada`, `severa` (o `NULL`) |
| `imagen_url` | `text` | Nullable | URL de la imagen ilustrativa | Enlace a la imagen periodística o `NULL` |
| `creado_en` | `timestamptz` | No aparece como nullable | Marca temporal de creación en DB | Fecha/hora con zona horaria de inserción del registro |

> [!NOTE]
> **Volumen de datos observado:**
> Al momento de esta documentación, la inspección en Supabase confirmó la presencia de **32 registros** en la tabla `noticias_historicas`.

### Row Level Security (RLS) en `noticias_historicas`:
Durante la inspección en Supabase se observó que la tabla `noticias_historicas` tenía el estado **`RLS disabled`** (Seguridad a Nivel de Fila deshabilitada). Esto se documenta estrictamente como el **estado observado durante la inspección**, sin implicar una recomendación ni un diseño permanente.

---

## 13. Diferencia entre reporte ciudadano y noticia

| Característica | Reporte ciudadano (`reportes`) | Noticia (`noticias_historicas`) |
| :--- | :--- | :--- |
| **Tabla en Supabase** | Sí (Confirmada) | Sí (Confirmada) |
| **Registros actuales** | **0 registros** (Vaca actualmente) | **32 registros observados** |
| **Origen de los datos** | Generado por ciudadanos mediante el formulario web | Recopilado de notas periodísticas e informes pasados |
| **Coordenadas** | `latitud` (`float8`), `longitud` (`float8`) | `latitud` (`float8`), `longitud` (`float8`) |
| **Clasificación / Tags** | `afectaciones` (`_text` / array de texto) | `tipo_evento` (`text`) |
| **Estado / Gravedad** | `estado` (`text`: `pendiente`/`validado`/`rechazado`) | `gravedad` (`text`: `moderada`/`severa`) |
| **Campos de fecha** | `creado_en` (`timestamptz`) | `fecha_publicacion` (`date`) y `creado_en` (`timestamptz`) |
| **Bucket de Storage** | `REPORTES` (Público) | `NOTICIAS_HISTORICAS` (Público) |
| **Marcador en Mapa** | Circular azul ([`ReportMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportMarker.tsx)) | Periódico flotante ([`NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx)) |

---

## 14. Supabase Storage y su relación con la Base de Datos

En el panel de Supabase Storage se comprobó la presencia de **dos buckets públicos**:

1. **`REPORTES`** (Público): Diseñado para alojar las imágenes adjuntadas a los reportes ciudadanos.
2. **`NOTICIAS_HISTORICAS`** (Público): Diseñado para albergar las imágenes asociadas a las noticias periodísticas.

### Políticas de seguridad observadas en el Bucket `REPORTES`:
Se verificaron 2 políticas activas en el bucket `REPORTES`:
* **Política 1 (`INSERT`)**: *"Permitir subir imagenes de reportes"*. Habilita la carga de archivos para roles `anon` y `authenticated`.
* **Política 2 (`SELECT`)**: *"Permitir ver imagenes de reportes"*. Habilita la lectura pública de archivos para roles `anon` y `authenticated`.

### Políticas en el Bucket `NOTICIAS_HISTORICAS`:
* Se observó la indicación *"No policies created yet"*. El acceso es público debido a la configuración global del bucket.

### Relación entre el archivo binario y la columna `imagen_url`:

```text
1. Usuario selecciona archivo JPG/PNG en ReportForm.tsx
                          │
                          ▼
2. Supabase Storage (Bucket 'REPORTES')
   Archivo binario almacenado en: imagenes/${uuid}.${ext}
                          │
                          ▼
3. Generación de URL Pública HTTP
   supabase.storage.from('reportes').getPublicUrl(...)
                          │
                          ▼
4. Persistencia en Base de Datos PostgreSQL
   Tabla: reportes
   Columna: imagen_url = "https://.../storage/v1/object/public/reportes/imagenes/..."
```

---

## 15. Flujos de lectura e inserción en el código

### Lecturas (`SELECT`)
* **`reportes`**: En [`MapView.tsx:131-134`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L131-L134) se leen los reportes ordenados por fecha: `.from('reportes').select('*').order('creado_en', { ascending: false })`.
* **`noticias_historicas`**: En [`MapView.tsx:160-163`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L160-L163) se leen las noticias ordenadas históricamente: `.from('noticias_historicas').select('*').order('fecha_publicacion', { ascending: false })`.

### Inserción (`INSERT`)
* **`reportes`**: En [`ReportForm.tsx:208-220`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L208-L220) se inserta la nueva incidencia: `.from('reportes').insert({...}).select().single()`.

### Actualizaciones (`UPDATE`) y Eliminaciones (`DELETE`)
* **No existen llamadas a `.update(` ni `.delete(` en el código de la aplicación cliente.**

---

## 16. Mapa de relación entre la Base de Datos, Storage y el Código

| Recurso (DB / Storage) | Archivo del proyecto | Operación realizada | Finalidad en la plataforma |
| :--- | :--- | :--- | :--- |
| Conexión Client | [`src/lib/supabase.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/lib/supabase.ts) | Inicialización | Instancia y exporta el cliente `supabase` usando variables de entorno. |
| Tabla `reportes` | [`src/components/ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx) | `INSERT` | Registra una nueva incidencia con coordenadas (`float8`), descripción (`text`), afectaciones (`_text`) y estado (`text`). |
| Tabla `reportes` | [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx) | `SELECT` | Consulta las incidencias para dibujarlas en los marcadores ([`ReportMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportMarker.tsx)), la lista lateral ([`SidebarReports.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SidebarReports.tsx)) y la capa de calor ([`HeatmapLayer.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/HeatmapLayer.tsx)). |
| Tabla `noticias_historicas` | [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx) | `SELECT` | Consulta las noticias pasadas para renderizar marcadores informativos ([`NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx)). |
| Bucket `REPORTES` | [`src/components/ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx) | `upload` / `getPublicUrl` | Almacena fotografías subidas por usuarios y obtiene el link guardado en `imagen_url`. |
| Bucket `NOTICIAS_HISTORICAS` | Panel de Supabase Storage | Lectura pública | Repositorio para alojar imágenes de respaldo de notas de prensa. |

---

## 17. Diagrama conceptual de arquitectura unificada

```text
                                  SUPABASE
                                     │
                      ┌──────────────┴──────────────┐
                      │                             │
                  DATABASE                       STORAGE
                      │                             │
                ┌─────┴─────┐                 ┌─────┴─────┐
                │           │                 │           │
             reportes   noticias_          REPORTES    NOTICIAS_
            (0 reg.)    historicas         (Público)   HISTORICAS
                       (32 reg.)                       (Público)
                │           │
                └─────┬─────┘
                      │
                   Next.js
                      │
                      ▼
               interfaz / mapa
```

---

## 18. Información confirmada vs. Pendientes de verificación

### Confirmado directamente en Supabase y Código:
* Existencia real de las tablas `reportes` y `noticias_historicas`.
* Tipos de datos PostgreSQL confirmados (`uuid`, `float8`, `text`, `_text`, `timestamptz`, `date`).
* `id` como Primary Key de tipo `uuid` en ambas tablas.
* `afectaciones` como array de texto (`_text`).
* Ausencia de registros en `reportes` (0 registros actualmente).
* Presencia de 32 registros observados en `noticias_historicas`.
* Valores observados para `tipo_evento` (`inundacion_fluvial`, `daños_infraestructura`, `anegamiento`, `NULL`).
* Valores observados para `gravedad` (`moderada`, `severa`, `NULL`).
* Estado `RLS disabled` observado en `noticias_historicas`.
* Buckets de Storage públicos `REPORTES` y `NOTICIAS_HISTORICAS`.
* Dos políticas de Storage activas en `REPORTES` (`INSERT` y `SELECT` para `anon`/`authenticated`).

### Pendiente de verificación directamente en Supabase:
* Expresiones SQL de valores por defecto (`DEFAULT`) exactas para `id`, `estado` y `creado_en`.
* Estado de RLS en la tabla `reportes`.
* Definición formal de claves foráneas (`FOREIGN KEY`), si estuvieran declaradas.
* Índices de base de datos creados sobre coordenadas o fechas.
* Triggers o funciones SQL personalizadas.

---

## 19. Ayuda memoria

```text
================================================================================
                               AYUDA MEMORIA
================================================================================
• reportes            -> Tabla para denuncias ciudadanas. Infraestructura lista,
                         actualmente sin registros (0 registros).
• noticias_historicas -> Tabla de notas periodísticas. 32 registros observados.
• REPORTES            -> Bucket de Storage público para fotos de reportes.
• NOTICIAS_HISTORICAS -> Bucket de Storage público para imágenes de noticias.

--------------------------------------------------------------------------------
Tipos de datos PostgreSQL confirmados:
--------------------------------------------------------------------------------
• uuid        -> Identificador único global (Primary Key).
• text        -> Cadena de texto.
• float8      -> Número decimal de doble precisión (usado en latitud y longitud).
• timestamptz -> Fecha y hora exacta con zona horaria (inserción en DB).
• date        -> Fecha calendario sin hora (fecha_publicacion de noticias).
• _text       -> Array de texto en PostgreSQL (usado en afectaciones).

--------------------------------------------------------------------------------
Comandos de consulta:
--------------------------------------------------------------------------------
• SELECT = Operación de LECTURA.
• INSERT = Operación de ESCRITURA / creación de registros.
================================================================================
```

---

## 20. Preguntas clave para la defensa de tesis

### ¿Qué motor de base de datos utiliza el sistema?
El sistema utiliza **PostgreSQL** administrado a través de la plataforma backend **Supabase**.

### ¿Qué diferencia hay entre la tabla `reportes` y `noticias_historicas`?
`reportes` es una estructura preparada para recibir denuncias ciudadanas en tiempo real desde el formulario web (actualmente sin registros en producción). `noticias_historicas` contiene 32 registros observados de eventos periodísticos pasados recopilados de medios masivos.

### ¿Por qué las coordenadas se almacenan como `float8`?
Porque `float8` en PostgreSQL corresponde a un número decimal de doble precisión de 64 bits, lo que provee la precisión submétrica necesaria para posicionar marcadores de latitud y longitud sobre mapas web.

### ¿Cómo se almacenan las afectaciones múltiples?
Se almacenan en la columna `afectaciones` utilizando el tipo de dato nativo de PostgreSQL `_text` (matriz o array de texto), lo que permite guardar múltiples etiquetas (ej: *Calle inundada*, *Árbol caído*) en una sola fila.

### ¿Cómo se relacionan las fotos con los registros de la base de datos?
Los archivos físicos de imagen se suben al bucket público `REPORTES` en **Supabase Storage**. Luego, la URL pública HTTP generada se persiste en la columna `imagen_url` (`text`) dentro de la tabla PostgreSQL.

---

# Pendientes de verificación en Supabase

- [ ] **Confirmar valores por defecto (`DEFAULT`) exactos**: Verificar las expresiones asignadas en servidor a `id`, `estado` y `creado_en` en `reportes`.
- [ ] **Confirmar RLS en la tabla `reportes`**: Inspeccionar el estado de Row Level Security y políticas de tabla para `reportes`.
- [ ] **Confirmar claves foráneas (`FOREIGN KEY`)**: Verificar si existen declaraciones explícitas de integridad referencial.
- [ ] **Confirmar índices creados**: Inspeccionar los índices existentes sobre las columnas de fecha y coordenadas.
- [ ] **Confirmar Triggers y Funciones SQL**: Verificar si existen Triggers asignados a las tablas en PostgreSQL.
