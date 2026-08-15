# Capítulo 10 · Noticias históricas

## 1. Qué son las noticias históricas

Las noticias históricas son un conjunto de registros estructurados que recopilan eventos pasados de anegamiento, tormentas severas y crecidas de arroyos en el Área Metropolitana de Asunción. Su propósito dentro del proyecto de tesis es enriquecer el sistema de monitoreo espacial con **memoria histórica georreferenciada**, permitiendo contrastar la vulnerabilidad pasada con las incidencias actuales.

### Utilidad para el estudio de eventos de inundación:
* **Identificación de zonas recurrentes**: Permite visualizar espacialmente los puntos de la ciudad que han sufrido anegamientos de forma reiterada a lo largo de los años.
* **Contextualización temporal**: Ofrece un registro documental de eventos extremos ocurridos en distintas épocas y administraciones urbanas.
* **Trazabilidad de fuentes**: Conserva la referencia al medio de comunicación u organismo oficial que cubrió la nota de prensa original.

### Diferencias conceptuales fundamentales:

```text
┌─────────────────────────────────────────────────────────────┐
│                    NOTICIA PERIODÍSTICA                     │
│    (Artículo periodístico original o nota de prensa)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Procesamiento y extracción)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             REGISTRO ESTRUCTURADO EN SUPABASE               │
│  (Fila en PostgreSQL: titulo, fecha_publicacion, lat, lng)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Renderizado en React Leaflet)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                REPRESENTACIÓN GEOGRÁFICA                    │
│   (Marcador con ícono naranja y popup en el mapa interactivo)│
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Tabla real de Supabase (`noticias_historicas`)

La estructura de la tabla `noticias_historicas` fue verificada directamente en el panel de control de Supabase. A continuación se detalla cada campo, su tipo de dato PostgreSQL nativo y su utilidad dentro del sistema:

| Campo | Tipo PostgreSQL | Descripción y utilidad en la plataforma |
| :--- | :--- | :--- |
| `id` | `uuid`, Primary Key | Identificador único global de cada registro de noticia. |
| `fecha_publicacion` | `date`, nullable | Fecha histórica original en la que ocurrió o fue publicada la nota periodística (formato `YYYY-MM-DD`). Se utiliza para ordenar las noticias cronológicamente y mostrarlas en la interfaz. |
| `titulo` | `text`, nullable | Titular o encabezado descriptivo del artículo periodístico. Es la cabecera principal del popup informativo. |
| `descripcion` | `text`, nullable | Resumen o cuerpo explicativo del impacto del evento. Se muestra en el popup para brindar contexto detallado. |
| `fuente` | `text`, nullable | Nombre del medio de prensa u organismo de origen (ej. *"Diario Última Hora"*, *"ABC Color"*). Otorga credibilidad y trazabilidad. |
| `url` | `text`, nullable | Enlace web externo a la noticia original. Habilita el botón *"Ver Noticia Completa"* en el popup. |
| `ubicacion_texto` | `text`, nullable | Descripción textual descriptiva del barrio, intersección o zona de impacto (ej. *"Barrio San Pablo"*, *"Avda. Fernando de la Mora"*). |
| `latitud` | `float8`, nullable | Coordenada numérica decimal de latitud (ej. `-25.3120`). Necesaria para ubicar el punto en el eje norte-sur del mapa. |
| `longitud` | `float8`, nullable | Coordenada numérica decimal de longitud (ej. `-57.5980`). Necesaria para ubicar el punto en el eje este-oeste del mapa. |
| `tipo_evento` | `text`, nullable | Categoría temática del suceso (ej. `inundacion_fluvial`, `anegamiento`, `daños_infraestructura`). |
| `gravedad` | `text`, nullable | Nivel de severidad asignado al evento (ej. `moderada`, `severa`). |
| `imagen_url` | `text`, nullable | Enlace HTTP a la fotografía o imagen ilustrativa guardada en Storage o servidor externo. |
| `creado_en` | `timestamptz` | Marca de tiempo con zona horaria de cuando la fila fue registrada físicamente en la base de datos de Supabase. |

---

## 3. Datos disponibles actualmente

Durante la verificación manual en el panel de Supabase se observaron **32 registros** almacenados en la tabla `noticias_historicas`.

* **Naturaleza de los datos**: Esta cifra corresponde al estado exacto de la base de datos al momento de realizar la presente documentación.
* **Escalabilidad**: El volumen de 32 registros no constituye una limitación rígida del diseño del sistema. La plataforma está preparada para almacenar y desplegar un número significativamente mayor de noticias históricas a medida que se incorporen nuevos registros.
* **Cobertura temporal**: Los registros existentes abarcan notas históricas de diversos años (observándose fechas desde 1998 hasta 2026), lo que confirma su función activa como catálogo histórico multitemporal.

---

## 4. Fecha de publicación y fecha de creación

Es fundamental diferenciar conceptualmente los dos campos temporales presentes en la tabla:

1. **`fecha_publicacion`** (`date`): Es la **fecha histórica original** en la que ocurrió el suceso o fue redactado el artículo periodístico (ej: `"1998-04-12"`). No contiene hora ni zona horaria.
2. **`creado_en`** (`timestamptz`): Es la **marca temporal de servidor** que registra el instante exacto en que la fila se insertó en la base de datos de Supabase.

> [!IMPORTANT]
> El ordenamiento y despliegue temporal en el mapa se realiza en base a **`fecha_publicacion`**, garantizando que los eventos se presenten según su cronología histórica real y no según el momento de su inserción técnica en el sistema.

---

## 5. Fuente y URL

* **`fuente`** (`text`): Almacena el nombre del medio de comunicación o entidad oficial de donde proviene la información. Garantiza la atribución periodística y la trazabilidad de los datos.
* **`url`** (`text`): Guarda la dirección web externa de la nota original.

### Comportamiento en la interfaz ([`NewsMarker.tsx:116-127`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx#L116-L127)):
Si el registro contiene un valor no nulo en la columna `url`, el componente `NewsMarker` renderiza un botón destacado en color naranja con el texto *"Ver Noticia Completa"*, el cual abre el enlace externo en una pestaña nueva del navegador (`target="_blank"`).

---

## 6. Ubicación textual vs. Coordenadas geográficas

En el diseño de la información coexisten dos formas complementarias de expresar la localización de una noticia histórica:

```text
 ┌─────────────────────────────────────────────────────────────┐
 │                UBICACIÓN TEXTUAL (ubicacion_texto)          │
 │       "Barrio San Pablo, sobre Avda. Eusebio Ayala"         │
 │   -> Descripción en lenguaje natural comprensible por humanos │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │              COORDENADAS GEOGRÁFICAS (latitud, longitud)     │
 │               latitud: -25.3120, longitud: -57.5980          │
 │   -> Par ordenado numérico float8 para posicionado en mapa   │
 └─────────────────────────────────────────────────────────────┘
```

---

## 7. Georreferenciación y despliegue cartográfico

Para que una noticia histórica se dibuje como un punto interactivo en el mapa, sus columnas numéricas `latitud` y `longitud` son procesadas por Leaflet mediante la siguiente secuencia comprobada en el código:

```text
 ┌─────────────────────────────────────────────────────────────┐
 │                      SUPABASE DATABASE                      │
 │   Tabla noticias_historicas: latitud (float8), longitud     │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼ (Consulta SELECT en MapView.tsx)
 ┌─────────────────────────────────────────────────────────────┐
 │                     REACT COMPONENT                         │
 │     news.latitud y news.longitud pasados a NewsMarker.tsx   │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼ (Componente React Leaflet)
 ┌─────────────────────────────────────────────────────────────┐
 │                 LEAFLET MARKER & POPUP                      │
 │    <Marker position={[news.latitud, news.longitud]}>        │
 └─────────────────────────────────────────────────────────────┘
```

---

## 8. Tipo de evento (`tipo_evento`)

Durante la inspección en Supabase se observaron valores guardados en la columna `tipo_evento` tales como:
* `inundacion_fluvial`
* `daños_infraestructura`
* `anegamiento`
* Registros con valor `NULL`.

> [!NOTE]
> Estos valores corresponden a lo **observado en las filas existentes** y no necesariamente representan una enumeración restrictiva (`ENUM`) fija en PostgreSQL.

### Uso en el código ([`NewsMarker.tsx:84-89`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx#L84-L89)):
Si la noticia contiene `tipo_evento`, el popup del marcador lo despliega en formato capitalizado en una etiqueta informativa dentro de la ventana del mapa.

---

## 9. Gravedad (`gravedad`)

En los registros existentes de Supabase se observaron valores para el campo `gravedad` como:
* `moderada`
* `severa`
* Registros con valor `NULL`.

### Uso en la aplicación ([`NewsMarker.tsx:91-98`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx#L91-L98)):
El frontend utiliza el campo `gravedad` exclusivamente para su despliegue informativo dentro del popup del marcador, resaltando el valor con un estilo de texto en negrita y color naranja (`text-orange-600 font-bold`).

---

## 10. Despliegue de imágenes (`imagen_url`)

La columna `imagen_url` almacena el enlace HTTP a una imagen representativa de la nota periodística.

### Comportamiento en la interfaz ([`NewsMarker.tsx:56-66`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx#L56-L66)):
* **Si `imagen_url` tiene valor**: El popup renderiza un contenedor optimizado mediante el componente `<Image>` de Next.js que muestra la fotografía dentro del marcador.
* **Si `imagen_url` es `NULL`**: El contenedor de la imagen no se renderiza en el DOM, manteniendo el popup compacto sin dejar recuadros vacíos.

---

## 11. Configuración de Supabase Storage (Bucket `NOTICIAS_HISTORICAS`)

En el panel de administración de Supabase Storage se verificó la existencia de un bucket público denominado:

* **`NOTICIAS_HISTORICAS`** (Público)

### Políticas de seguridad observadas:
Durante la inspección manual se observó el estado *"No policies created yet"*. El bucket es de acceso público debido a su configuración general en el panel de Supabase.

---

## 12. Consulta desde el frontend (`MapView.tsx`)

La lectura de noticias históricas desde la base de datos se realiza dentro del hook `useEffect` del componente [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L160-L188):

```typescript
const { data: newsData, error: newsError } = await supabase
  .from('noticias_historicas')
  .select('*')
  .order('fecha_publicacion', { ascending: false });

if (newsError) {
  console.error('Error al cargar noticias históricas:', newsError);
} else if (newsData) {
  const validNews = newsData
    .filter(n => n.latitud !== null && n.longitud !== null && !isNaN(Number(n.latitud)) && !isNaN(Number(n.longitud)))
    .map(n => ({
      ...n,
      latitud: Number(n.latitud),
      longitud: Number(n.longitud)
    }));
  setNews(validNews);
}
```

* **Validación de coordenadas**: El frontend descarta dinámicamente cualquier registro que tenga `latitud` o `longitud` nula o no numérica (`NaN`), asegurando que solo se envíen al mapa marcadores con posiciones geográficas válidas.

---

## 13. Recorrido completo del dato

```text
1. PostgreSQL en Supabase almacena 32 filas en la tabla 'noticias_historicas'
                                │
                                ▼
2. MapView.tsx realiza la petición asíncrona: supabase.from('noticias_historicas').select('*')
                                │
                                ▼
3. El frontend filtra registros con coordenadas válidas y actualiza el estado React 'news'
                                │
                                ▼
4. useMemo aplica los filtros activos (ej. toggle 'showNews' en FilterPanel.tsx)
                                │
                                ▼
5. filteredNews.map() renderiza componentes <NewsMarker> sobre el mapa
                                │
                                ▼
6. Leaflet instancia los marcadores con ícono SVG naranja (#f97316) y Popups informativos
```

---

## 14. Representación visual de noticias en el mapa

Las noticias históricas se representan sobre el lienzo cartográfico utilizando el componente especializado [`src/components/NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx):

* **Ícono personalizado (`L.divIcon`)**: Ícono vectorial SVG con forma de pin cartográfico de color naranja (`#f97316`) con borde blanco y un punto central.
* **Interacción**: Al hacer clic sobre el ícono naranja, se abre un popup flotante con el detalle periodístico.

---

## 15. Estructura del Popup de noticia histórica

El popup desplegado por `NewsMarker.tsx` incluye exactamente los siguientes campos comprobados en el código:

1. **Insignia de categoría**: Etiqueta superior con el texto *"NOTICIA HISTÓRICA"* en color naranja.
2. **Título**: Titular completo de la nota (`news.titulo`) en mayúsculas.
3. **Fotografía**: Renderizada mediante `<Image>` de Next.js si `news.imagen_url` existe.
4. **Descripción**: Muestra `news.descripcion` (o un fallback al `titulo` si la descripción es nula).
5. **Metadatos en cuadrícula**:
   * **Fecha**: Formateada en `dd/MM/yyyy` a partir de `news.fecha_publicacion`.
   * **Tipo**: Muestra `news.tipo_evento` si está presente.
   * **Gravedad**: Muestra `news.gravedad` resaltado en negrita.
   * **Fuente**: Muestra `news.fuente` en texto cursivo.
   * **Ubicación**: Muestra `news.ubicacion_texto` ocupando el ancho completo.
6. **Enlace externo**: Botón *"Ver Noticia Completa"* que redirige a `news.url` en una nueva pestaña.

---

## 16. Filtros que afectan a las noticias

En el panel flotante [`FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx) se comprueban los siguientes controles aplicables a la capa de noticias:

| Filtro en Interfaz | Estado React en `MapView.tsx` | Resultado en el mapa |
| :--- | :--- | :--- |
| **Mostrar Noticias** (Toggle) | `showNews` (`boolean`) | Enciende o apaga la visibilidad de todos los marcadores de noticias históricas. |
| **Mapa de Calor** (Toggle) | `isHeatmapVisible` (`boolean`) | Al activar el mapa de calor, se ocultan los marcadores individuales de noticias para mostrar únicamente la densidad de reportes. |

---

## 17. Comparación entre Noticias Históricas y Reportes Ciudadanos

| Aspecto | Noticias históricas (`noticias_historicas`) | Reportes ciudadanos (`reportes`) |
| :--- | :--- | :--- |
| **Origen de los datos** | Medios masivos de comunicación y notas periodísticas recopiladas. | Formulario web enviado dinámicamente por vecinos en tiempo real. |
| **Registros en Supabase** | **32 registros observados** en producción. | **0 registros actualmente** (infraestructura preparada). |
| **Fecha principal** | `fecha_publicacion` (`date` - fecha histórica del evento). | `creado_en` (`timestamptz` - marca temporal de inserción). |
| **Categorización** | `tipo_evento` (`text`: `inundacion_fluvial`, etc.). | `afectaciones` (`_text`: array de etiquetas). |
| **Estado / Severidad** | `gravedad` (`text`: `moderada`, `severa`). | `estado` (`text`: `pendiente`, `validado`, `rechazado`). |
| **Ícono en el mapa** | Marcador vectorial SVG de color naranja ([`NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx)). | Marcador vectorial SVG de color azul ([`ReportMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportMarker.tsx)). |
| **Enlace externo** | Contiene `url` externa a la nota original. | No posee enlace externo. |

---

## 18. Origen de los datos históricos actuales

> [!IMPORTANT]
> **Aviso de verificación técnica sobre la carga de datos:**
> Tras inspeccionar exhaustivamente la totalidad del repositorio del proyecto (`my-app`), **no se encontró ningún script de carga masiva (`seed.sql`), código de importación desde CSV ni archivo de migración automática**.
> 
> Por lo tanto, se establece formalmente que:
> **El mecanismo exacto utilizado para obtener/cargar los 32 registros históricos existentes en Supabase no puede determinarse únicamente a partir del código fuente inspeccionado.**
> Los datos fueron ingresados previamente de forma directa en el panel de Supabase o mediante herramientas externas a este repositorio.

---

## 19. Web Scraping (Estado actual vs. Funcionalidad futura)

* **Estado actual en la plataforma**: **NO existe actualmente un módulo de Web Scraping implementado** dentro del código del proyecto.
* **Proyección futura**: El web scraping se plantea como una línea de desarrollo futuro para automatizar la extracción de noticias de portales digitales de noticias y cargarlas automáticamente en la tabla `noticias_historicas`.

---

## 20. Importancia para el análisis posterior

Tener una base de datos histórica georreferenciada permite planificar análisis de valor agregado para la tesis:
* **Identificación de puntos calientes históricos**: Mapear cuáles intersecciones viales sufren anegamientos recurrentes independientemente del año.
* **Modelos de riesgo urbano**: Combinar la frecuencia histórica de noticias con capas de altimetría y cauces hídricos.
* **Validación cruzada**: Comparar zonas reportadas por ciudadanos contra la evidencia histórica periodística.

---

## 21. Calidad de los datos observados

Durante la inspección de los datos se comprobaron las siguientes particularidades:
* **Presencia de valores `NULL`**: Algunas noticias no disponen de `descripcion`, `fuente`, `url`, `tipo_evento` o `gravedad`.
* **Manejo defensivo en el frontend**: El componente `NewsMarker.tsx` incluye funciones defensivas (`hasValue`) para ocultar limpiamente los campos que sean nulos, evitando errores de renderizado.

---

## 22. Row Level Security (RLS) en `noticias_historicas`

Durante la inspección en el panel de Supabase se observó que la tabla `noticias_historicas` tiene el estado **`RLS disabled`** (Seguridad a Nivel de Fila deshabilitada). Esto se documenta estrictamente como el **estado observado en el servidor durante la inspección**.

---

## 23. Inventario de archivos involucrados

| Archivo | Ruta física | Responsabilidad |
| :--- | :--- | :--- |
| **Marcador de Noticia** | [`src/components/NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx) | Dibuja el marcador naranja SVG e instanciar el popup con la información periodística. |
| **Vista Principal Mapa** | [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx) | Consulta la tabla `noticias_historicas` en Supabase, valida coordenadas y administra los estados. |
| **Panel de Filtros** | [`src/components/FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx) | Provee el control de visibilidad (`showNews`). |
| **Tipos TypeScript** | [`src/types/report.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/types/report.ts) | Define la interfaz `NoticiaHistorica`. |

---

## 24. Guía práctica para modificar la funcionalidad de noticias

* **Si quiero cambiar la consulta a la base de datos**: Modifica el `useEffect` en [`src/components/MapView.tsx:160-188`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L160-L188).
* **Si quiero modificar el ícono o color de las noticias**: Modifica la constante `ORANGE_COLOR` o la función `createCustomIcon` en [`src/components/NewsMarker.tsx:9-26`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx#L9-L26).
* **Si quiero modificar los campos mostrados en el popup**: Edita la estructura JSX en [`src/components/NewsMarker.tsx:43-129`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx#L43-L129).
* **Si quiero agregar un nuevo filtro de noticias**: Modifica el estado en `MapView.tsx` y los controles en `FilterPanel.tsx`.

---

## 25. Estado actual de la implementación

### Implementado actualmente:
* Estructura de tabla `noticias_historicas` en Supabase.
* Consulta `SELECT` en `MapView.tsx` con filtrado defensivo de coordenadas `NaN`.
* Componente visual `NewsMarker.tsx` con popup completo e ícono SVG naranja.
* Botón para abrir la noticia original en una URL externa.
* Toggle de visibilidad en el panel de filtros (`showNews`).

### Datos disponibles actualmente:
* **32 registros históricos** verificados en Supabase.

### Funcionalidades futuras (No implementadas actualmente):
* Módulo de Web Scraping para extracción automática de noticias.
* Scripts de carga masiva `seed` en el repositorio.

---

## 26. Ayuda memoria

```text
================================================================================
                               AYUDA MEMORIA
================================================================================
• noticias_historicas -> Tabla de datos en Supabase para notas de prensa pasadas.
• fecha_publicacion   -> Fecha histórica original del evento (date).
• fuente              -> Medio periodístico u organismo emisor de la nota.
• url                 -> Enlace web a la noticia completa original.
• ubicacion_texto     -> Descripción textual legible de la ubicación.
• latitud / longitud  -> Coordenadas float8 para dibujar el punto en Leaflet.
• tipo_evento         -> Clasificación temática (inundacion_fluvial, etc.).
• gravedad            -> Nivel de severidad (moderada, severa).
• imagen_url          -> Referencia HTTP a la imagen ilustrativa.
• NewsMarker.tsx      -> Componente React que renderiza el ícono naranja y popup.
================================================================================
```

---

## 27. Preguntas que debería poder responder

### ¿Por qué se incorporan noticias históricas en el proyecto?
Para otorgar memoria histórica al sistema de monitoreo, identificando zonas de anegamiento recurrente y permitiendo comparar eventos pasados con los reportes actuales.

### ¿Qué información almacena la tabla `noticias_historicas`?
Almacena 32 registros verificados con titular, descripción, fecha de publicación, fuente, URL externa, ubicación textual, gravedad, tipo de evento, coordenadas `float8` y enlace a imagen.

### ¿Cómo se georreferencia una noticia?
A través de las columnas decimales `latitud` y `longitud` (`float8`). `MapView.tsx` lee estos valores y se los transfiere a `NewsMarker.tsx`, que los ubica sobre el mapa usando el componente `<Marker>` de React Leaflet.

### ¿Cuál es la diferencia entre `ubicacion_texto` y las coordenadas?
`ubicacion_texto` es una descripción en lenguaje natural legible para humanos (ej: *"Barrio San Pablo"*), mientras que las coordenadas son el par ordenado numérico necesario para el motor cartográfico.

### ¿Las noticias actuales se cargan mediante Web Scraping?
No. Actualmente **no existe un módulo de Web Scraping implementado** en el código. Los 32 registros existentes fueron ingresados externamente o directamente en el panel de Supabase. El web scraping se contempla como una mejora futura.

---

## 28. Resumen visual de arquitectura

```text
              FLUJO ACTUAL IMPLEMENTADO
 ┌──────────────────────────────────────────────────┐
 │           BASE DE DATOS EN SUPABASE              │
 │        Tabla noticias_historicas (32 reg.)        │
 └────────────────────────┬─────────────────────────┘
                          │
                          ▼
 ┌──────────────────────────────────────────────────┐
 │            APLICACIÓN NEXT.JS / REACT            │
 │   MapView.tsx (Petición SELECT y filtro coords)  │
 └────────────────────────┬─────────────────────────┘
                          │
                          ▼
 ┌──────────────────────────────────────────────────┐
 │             MAPA INTERACTIVO LEAFLET             │
 │   NewsMarker.tsx (Ícono SVG naranja + Popup UI)  │
 └──────────────────────────────────────────────────┘

              FLUJO FUTURO PROYECTADO
 ┌──────────────────┐       ┌──────────────────┐
 │ SITIOS DE PRENSA │ ──►   │   WEB SCRAPING   │ ──► Supabase
 └──────────────────┘       └──────────────────┘
```
