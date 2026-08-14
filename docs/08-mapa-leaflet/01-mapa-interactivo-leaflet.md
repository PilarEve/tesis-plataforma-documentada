# Capítulo 08 · Mapa interactivo y Leaflet

## 1. Introducción y contextualización

El mapa interactivo constituye el núcleo de la plataforma web de monitoreo de inundaciones en el Área Metropolitana de Asunción. Su objetivo principal es transformar datos alfanuméricos y registros estructurados almacenados en **Supabase** en representaciones espaciales dinámicas sobre un territorio digital.

Este capítulo documenta exhaustivamente la arquitectura, integración y funcionamiento del mapa web del proyecto (`my-app`), desde los conceptos teóricos fundamentales de la cartografía web hasta los componentes específicos en TypeScript/React que consumen Leaflet y alimentan la interfaz de usuario.

---

## 2. ¿Qué papel cumple el mapa en la plataforma?

El mapa interactivo actúa como el eje central de visualización y recepción de información sobre eventos hidrometeorológicos y anegamientos urbanos.

### Funciones principales en la plataforma:
1. **Representación territorial de Noticias Históricas (`noticias_historicas`)**: Despliega en el mapa **32 registros históricos** verificados en la base de datos de Supabase, geolocalizando inundaciones severas y notas de prensa pasadas (años 1998 a 2026).
2. **Recepción y despliegue de Reportes Ciudadanos (`reportes`)**: Proporciona el mapa base sobre el cual los usuarios ubican espacialmente nuevos incidentes y permite visualizar los reportes ciudadanos en tiempo real. 
   > [!NOTE]
   > **Estado actual de los datos**: La tabla `reportes` y el formulario de envío están completamente integrados y operativos en el código, aunque al momento de la documentación la tabla no posee registros en producción.
3. **Capa analítica de mapa de calor (`HeatmapLayer`)**: Permite proyectar la densidad geográfica del agua estancada e incidencias para identificar puntos críticos de vulnerabilidad urbana.
4. **Geolocalización activa e interactiva**: Permite a los usuarios ubicar su posición GPS actual (`navigator.geolocation`) o seleccionar mediante un clic la ubicación de un reporte.

---

## 3. ¿Qué es Leaflet y React Leaflet?

### Leaflet
**Leaflet** es una biblioteca de JavaScript de código abierto, ligera y optimizada para la creación de mapas interactivos adaptables a dispositivos móviles (*mobile-friendly*). 

* **Problema que resuelve**: Maneja la renderización de cuadrículas de imágenes cartográficas (tiles), el cálculo dinámico de niveles de zoom, la proyección de coordenadas geográficas (WGS84 latitud/longitud) a coordenadas de píxeles en pantalla, y los eventos de interacción del usuario (arrastre, zoom, clic).

### React Leaflet
**React Leaflet** es una abstracción en forma de componentes para React que envuelve las clases nativas de Leaflet. 

* **Diferencia técnica**: Leaflet interactúa directamente con el DOM del navegador mediante la clase `L.Map`. React Leaflet provee componentes descriptivos como `<MapContainer>`, `<TileLayer>` y `<Marker>` que sincronizan el ciclo de vida del mapa con el estado de React (`useState`, `useEffect`).

```text
┌─────────────────────────────────────────────────────────────┐
│                    REACT LEAFLET COMPONENT                  │
│       (<MapContainer center={[-25.2855, -57.6150]}>)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Abstracción en React)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     LEAFLET JS LIBRARY                      │
│                  (L.map('map-id').setView(...))             │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Renderizado Canvas / DOM)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB (DOM)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Dependencias del proyecto relacionadas con el mapa

En el archivo [`package.json`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json) se comprueban las siguientes dependencias cartográficas:

| Dependencia | Versión | Función en la plataforma |
| :--- | :--- | :--- |
| `leaflet` | `^1.9.4` | Biblioteca JavaScript central para el motor de mapas interactivos. |
| `react-leaflet` | `^5.0.0` | Binding y componentes React para Leaflet v1.9+. |
| `leaflet.heat` | `^0.2.0` | Plugin nativo de Leaflet para generar capas analíticas de mapas de calor (*heatmap*). |
| `@types/leaflet` | `^1.9.21` | Definiciones de tipos TypeScript para la API de Leaflet. |
| `@types/leaflet.heat` | `^0.2.5` | Definiciones de tipos TypeScript para el plugin `leaflet.heat`. |

---

## 5. Ubicación del mapa y jerarquía de componentes

El sistema de mapas no está en un solo archivo, sino estructurado en capas modularizadas dentro del proyecto:

```text
Ruta de la app Next.js (/mapa)
      └─ app/mapa/page.tsx
           └─ src/components/MapClient.tsx  (Carga dinámica ssr: false)
                └─ src/components/MapView.tsx  (Componente principal de Mapa)
                     ├─ src/components/ReportMarker.tsx (Marcadores de reportes)
                     ├─ src/components/NewsMarker.tsx (Marcadores de noticias)
                     ├─ src/components/FilterPanel.tsx (Panel de capas y filtros)
                     ├─ src/components/SidebarReports.tsx (Lista lateral)
                     ├─ src/components/SearchBar.tsx (Geocodificación Nominatim)
                     ├─ src/components/HeatmapLayer.tsx (Capa de calor Leaflet.heat)
                     └─ src/components/CustomZoomControl.tsx (Controles de zoom UI)
```

### Rutas físicas confirmadas:
* **Página contenedora**: [`app/mapa/page.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/app/mapa/page.tsx)
* **Wrapper Cliente con Carga Dinámica**: [`src/components/MapClient.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapClient.tsx)
* **Vista Principal del Mapa**: [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx)

---

## 6. Uso de la directiva `"use client"`

Tanto [`MapClient.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapClient.tsx#L1) como [`MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L1) comienzan con la directiva `"use client"`.

### Explicación técnica:
Next.js utiliza el App Router por defecto para ejecutar renderizado en el servidor (Server Components). Sin embargo:
1. Leaflet necesita acceder de inmediato al objeto global `window` y al objeto `document` del navegador para escuchar eventos de ratón/táctiles y dibujar elementos `<svg>` o `<canvas>`.
2. `"use client"` le indica a Next.js que este componente y sus hijos deben incluirse en el bundle ejecutable del navegador web del cliente, permitiendo el uso de hooks de React (`useState`, `useEffect`, `useMemo`).

---

## 7. Carga dinámica e incompatibilidad con SSR (`ssr: false`)

Si Next.js intenta pre-renderizar Leaflet en el servidor de Node.js durante la fase de compilación, la aplicación fallará con el error `ReferenceError: window is not defined`.

### Solución implementada en [`src/components/MapClient.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapClient.tsx#L7-L17):

```typescript
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-blue-700">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-semibold text-lg animate-pulse">Cargando mapa interactivo...</p>
      </div>
    </div>
  )
});
```

* **`dynamic()`**: Función de Next.js para importar módulos mediante splitting de código.
* **`ssr: false`**: Desactiva totalmente la renderización en el servidor para `MapView.tsx`, asegurando que Leaflet solo se instancie una vez que la página haya cargado en el navegador del cliente.
* **`loading`**: Muestra una pantalla de carga pulida mientras el cliente descarga los scripts cartográficos.

---

## 8. Creación e inicialización del mapa (`MapContainer`)

En [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L415-L422), el lienzo interactivo se crea mediante el componente `<MapContainer>`:

```tsx
<MapContainer 
  center={ASUNCION_CENTER} 
  zoom={13} 
  zoomControl={false}
  className="w-full h-full z-0"
  style={{ height: '100%', width: '100%' }}
  ref={setMapRef}
>
  {/* Capas base y marcadores */}
</MapContainer>
```

---

## 9. Centro geográfico y nivel de zoom inicial

* **Centro inicial (`ASUNCION_CENTER`)**: Configurado explícitamente en el par de coordenadas `[-25.2855, -57.6150]` ([`MapView.tsx:21`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L21)), correspondiente al centro urbano de la Ciudad de Asunción, Paraguay.
* **Zoom inicial**: Configurado en nivel `13`, ofreciendo un encuadre óptimo del Área Metropolitana de Asunción (incluyendo accesos principales y cauces de arroyos urbanos).
* **`zoomControl={false}`**: Desactiva los botones por defecto de Leaflet `+` y `-` para reemplazarlos por el componente personalizado [`CustomZoomControl.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/CustomZoomControl.tsx) ubicado en la esquina inferior derecha.

---

## 10. Representación de Latitud y Longitud

### Conceptos:
* **Latitud (`latitud` / `lat`)**: Grado de desviación al norte o sur del Ecuador (para Paraguay es siempre un valor negativo, aprox. `-25.28`).
* **Longitud (`longitud` / `lng`)**: Grado de desviación al este u oeste del Meridiano de Greenwich (para Paraguay es siempre un valor negativo, aprox. `-57.61`).

### Flujo de datos espaciales desde Supabase al Mapa:

```text
Supabase Database (PostgreSQL)
  Columna 'latitud': float8  (ej: -25.2855)
  Columna 'longitud': float8 (ej: -57.6150)
        │
        ▼
Consulta SDK en MapView.tsx
  dbReport.latitud / dbReport.longitud
        │
        ▼
Mapeo a Objeto JavaScript / TypeScript
  { lat: Number(dbReport.latitud), lng: Number(dbReport.longitud) }
        │
        ▼
React Leaflet Component
  <ReportMarker position={[report.lat, report.lng]} />
        │
        ▼
Leaflet dibuja el icono en la coordenada del lienzo de pantalla
```

---

## 11. Funcionamiento del `TileLayer` (Capas de Mapa Base)

Un mapa web no descarga una sola imagen gigantesca de la tierra. Leaflet utiliza **tiles** (mosaicos o azulejos cuadrados de 256x256 píxeles) solicitados dinámicamente vía HTTP según las coordenadas `x`, `y` y el nivel de zoom `z`.

```text
Leaflet (Navegador)
  │ Petición de mosaicos según encuadre visible:
  │ GET https://a.basemaps.cartocdn.com/light_all/13/2329/4281.png
  ▼
Servidor de Mapas (CARTO / Esri)
  │ Retorna imágenes PNG/WebP de 256x256 px
  ▼
Visualización continua del terreno en pantalla
```

---

## 12. Mapas base configurados en la plataforma

En [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L23-L36), se definen 3 proveedores de mapas base intercambiables:

| Clave interna | Nombre en UI | Proveedor / URL del TileLayer | Finalidad |
| :--- | :--- | :--- | :--- |
| `light` *(Por defecto)* | Claro | `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png` (CARTO) | Fondo claro de alto contraste que resalta marcadores de colores. |
| `voyager` | Color | `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png` (CARTO) | Mapa topográfico urbano completo con relief e infraestructura. |
| `satellite` | Satélite | `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` (Esri World Imagery) | Fotografía satelital real para analizar cauces de arroyos y vegetación. |

---

## 13. Cambio dinámico entre mapas base

En lugar de utilizar el control flotante clásico de Leaflet, la aplicación utiliza una interfaz de selector de mapas base integrado en el componente [`FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx#L162-L199).

* **Estado en React**: En `MapView.tsx` se define el estado `const [activeBaseMap, setActiveBaseMap] = useState<'voyager' | 'light' | 'satellite'>('light')`.
* **Renderizado**:
  ```tsx
  <TileLayer
    url={BASE_MAPS[activeBaseMap].url}
    attribution={BASE_MAPS[activeBaseMap].attribution}
  />
  ```
Al hacer clic en los botones de "Claro", "Color" o "Satélite" del panel, el estado de React se actualiza y `<TileLayer>` re-renderiza instantáneamente la capa de mosaicos sin reiniciar los marcadores.

---

## 14. Obtención de datos desde Supabase en `MapView.tsx`

Al montarse el componente `MapView.tsx`, se ejecuta un hook `useEffect` ([`MapView.tsx:127-203`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L127-L203)) que realiza dos consultas asíncronas independientes a la base de datos de Supabase:

### 1. Consulta a la tabla `reportes`:
```typescript
const { data, error } = await supabase
  .from('reportes')
  .select('*')
  .order('creado_en', { ascending: false });
```

### 2. Consulta a la tabla `noticias_historicas`:
```typescript
const { data: newsData, error: newsError } = await supabase
  .from('noticias_historicas')
  .select('*')
  .order('fecha_publicacion', { ascending: false });
```

---

## 15. Renderizado de Noticias Históricas

Las noticias históricas leídas desde Supabase son filtradas para garantizar que contengan coordenadas numéricas válidas y se mapean en pantalla utilizando el componente personalizado [`NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx):

```tsx
{!isHeatmapVisible && filteredNews.map(noticia => (
  <NewsMarker key={`news-${noticia.id}`} news={noticia} />
))}
```

* **Datos representados**: 32 noticias históricas reales sobre anegamientos, desbordes de arroyos y severidad de tormentas en Asunción.

---

## 16. Renderizado de Reportes Ciudadanos

Los reportes ciudadanos se leen de la tabla `reportes` y se mapean al componente [`ReportMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportMarker.tsx):

```tsx
{!isHeatmapVisible && filteredReports.map(report => (
  <ReportMarker key={report.id} report={report} />
))}
```

* **Diferenciación**: La infraestructura de visualización está completamente lista. Si la base de datos no retorna registros en la tabla `reportes`, el código contempla un fallback condicional a datos simulados de demostración (`mockReports`) para garantizar que la interfaz pueda evaluarse visualmente durante el desarrollo.

---

## 17. Funcionamiento de Marcadores (`Marker`)

Los marcadores son los componentes visuales colocados en un punto exacto `[lat, lng]`.

* **`ReportMarker.tsx`**: Renderiza cada reporte ciudadano.
* **`NewsMarker.tsx`**: Renderiza cada noticia histórica.
* Ambos componentes envuelven el marcador de React Leaflet:
  ```tsx
  <Marker position={[report.lat, report.lng]} icon={reportIcon}>
    <Popup>...</Popup>
  </Marker>
  ```

---

## 18. Iconos personalizados SVG (`L.divIcon`)

En lugar de utilizar los pines predeterminados de Leaflet (que requieren archivos `.png` externos), el proyecto crea **iconos vectoriales dinámicos mediante `L.divIcon`**.

### Icono de Reportes Ciudadanos ([`ReportMarker.tsx:18-35`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportMarker.tsx#L18-L35)):
Icono circular de color azul (`#3b82f6`) con borde blanco y un punto central.

### Icono de Noticias Históricas ([`NewsMarker.tsx:18-35`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx#L18-L35)):
Icono cuadrado redondeado con gradiente oscuro y un emblema de periódico SVG de color ámbar/dorado (`#f59e0b`).

---

## 19. Popups informativos (`Popup`)

Un `Popup` es la ventana flotante que aparece sobre el mapa cuando un usuario hace clic o toca sobre un marcador.

### Contenido de Popup en `ReportMarker.tsx`:
* **Estado de validación**: Insignia con color según el estado (`pendiente`, `validado`, `rechazado`).
* **Fecha y Hora**: Formateada en texto accesible.
* **Descripción**: Texto ingresado por el ciudadano.
* **Afectaciones**: Etiquetas (Tags) de daños seleccionados.
* **Fotografía de evidencia**: Renderizada si `imageUrl` existe.

### Contenido de Popup en `NewsMarker.tsx`:
* **Insignia de Severidad**: Color según gravedad (`severa` / `alta`: rojo, `moderada`: naranja, `leve`: amarillo).
* **Título y Fuente**: Titular periodístico y medio de comunicación (ej. *Diario Última Hora*).
* **Fecha de Publicación**: Fecha histórica del evento.
* **Ubicación en texto**: Nombre descriptivo del barrio o zona.
* **Enlace externo**: Botón "Ver noticia completa" que abre la `url` original de la noticia.

---

## 20. Despliegue de Imágenes en Popups y Modales

Cuando un registro incluye la propiedad `imagen_url`:

```tsx
{report.imageUrl && (
  <div className="w-full h-36 relative rounded-lg overflow-hidden bg-slate-100 mb-2">
    <img 
      src={report.imageUrl} 
      alt="Evidencia del reporte" 
      className="w-full h-full object-cover" 
    />
  </div>
)}
```

Si `imagen_url` es `null` o `undefined`, el contenedor de la imagen no se renderiza en el DOM, manteniendo el popup compacto y limpio.

---

## 21. Sistema completo de Filtros de Interfaz

En [`src/components/FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx), se implementa un control flotante para filtrar las capas del mapa en tiempo real:

| Filtro | Estado en React | Qué hace en el mapa |
| :--- | :--- | :--- |
| **Mostrar Reportes** | `showReports` (`boolean`) | Enciende o apaga la capa completa de reportes ciudadanos. |
| **Mostrar Noticias** | `showNews` (`boolean`) | Enciende o apaga la capa de noticias históricas. |
| **Estado del Reporte** | `selectedStatuses` (`string[]`) | Filtra reportes por `pendiente`, `validado` o `rechazado`. |
| **Rango de Fechas** | `selectedDateRange` (`string`) | Filtra por tiempo: `todo`, `hoy`, `7dias`, `30dias`. |
| **Afectaciones (Tags)** | `selectedTags` (`string[]`) | Filtra reportes que contengan etiquetas específicas (ej. *Calle inundada*). |
| **Mapa de Calor** | `isHeatmapVisible` (`boolean`) | Oculta marcadores individuales y activa la densidad de calor. |
| **Mapa Base** | `activeBaseMap` (`string`) | Cambia los mosaicos entre Claro, Color y Satélite. |

---

## 22. Funcionamiento interno del filtrado en memoria (`useMemo`)

Los datos recuperados de Supabase no se vuelven a consultar al servidor al cambiar un filtro. Se procesan de forma eficiente en memoria mediante el hook **`useMemo`** en [`MapView.tsx:205-266`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L205-L266):

```text
Usuario activa/desactiva un filtro en FilterPanel.tsx
                        │
                        ▼
Actualización de Estado de React (ej: setSelectedStatuses)
                        │
                        ▼
Ejecución de useMemo en MapView.tsx
  1. Filtra array por afectaciones (selectedTags)
  2. Filtra array por estado (selectedStatuses)
  3. Filtra array por fecha (selectedDateRange)
                        │
                        ▼
Retorna nuevo array: filteredReports / filteredNews
                        │
                        ▼
React re-renderiza solo los marcadores correspondientes en Leaflet
```

---

## 23. Panel lateral de reportes (`SidebarReports`)

El componente [`src/components/SidebarReports.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SidebarReports.tsx) despliega una lista colapsable en el margen izquierdo de la pantalla.

* **Interacción con el mapa**: Al hacer clic en cualquiera de las tarjetas de reporte de la lista, se dispara la función `onSelectReport`, ejecutando `mapRef.setView([report.lat, report.lng], 16)` para sobrevolar y hacer zoom automático directamente sobre la ubicación de la incidencia seleccionada.

---

## 24. Búsqueda de lugares geográficos (Nominatim Geocoding)

El componente [`src/components/SearchBar.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SearchBar.tsx) permite a los usuarios buscar barrios, calles o puntos de interés en Paraguay.

```text
Usuario escribe en SearchBar ("Villa Morra")
                        │
                        ▼
Petición API a OpenStreetMap Nominatim
  GET https://nominatim.openstreetmap.org/search?q=Villa+Morra&countrycodes=py&format=json
                        │
                        ▼
Retorno de Coordenadas (lat: -25.297, lon: -57.585)
                        │
                        ▼
Vuelo animado del Mapa mediante Leaflet API
  mapRef.flyTo([lat, lon], 16, { animate: true, duration: 1.5 })
```

---

## 25. Geolocalización del dispositivo (`navigator.geolocation`)

En el formulario de registro ([`ReportForm.tsx:90-110`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L90-L110)), el usuario puede obtener su posición GPS en tiempo real.

* **Mecanismo**: Utiliza la API nativa HTML5 `navigator.geolocation.getCurrentPosition()`.
* **Uso**: Obtiene la latitud y longitud actuales del teléfono móvil o computadora y las carga automáticamente en los campos del formulario, desplazando el mini-mapa selector de posición mediante `map.flyTo([lat, lng])`.

---

## 26. Mapa de calor (`HeatmapLayer`)

En [`src/components/HeatmapLayer.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/HeatmapLayer.tsx), se integra el plugin nativo `leaflet.heat`.

```typescript
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export default function HeatmapLayer({ reports, isVisible }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!isVisible || !reports.length) return;

    const points = reports.map(r => [r.lat, r.lng, 0.8]);
    const heatLayer = (L as unknown as { heatLayer: Function }).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    });

    heatLayer.addTo(map);
    return () => { map.removeLayer(heatLayer); };
  }, [map, reports, isVisible]);
}
```

* **Función**: Convierte los puntos discretos en degradados continuos de densidad (azul -> verde -> rojo) para visualización analítica.

---

## 27. Capas Base vs. Capas de Superposición (Overlays)

* **Capas Base (Base Layers)**: Fondo cartográfico mutuamente excluyente (solo se puede ver un mapa base a la vez: Claro, Color o Satélite).
* **Capas de Superposición (Overlays)**: Capas con transparencia que se dibujan por encima del mapa base y pueden activarse simultáneamente (Marcadores de reportes, Marcadores de noticias, Capa de calor).

---

## 28. Estados principales de React (`useState`) en `MapView.tsx`

| Estado | Tipo | Propósito |
| :--- | :--- | :--- |
| `reports` | `Report[]` | Almacena los reportes ciudadanos recuperados de Supabase. |
| `news` | `NoticiaHistorica[]` | Almacena las noticias históricas recuperadas de Supabase. |
| `loading` | `boolean` | Controla el indicador visual de carga de datos en la parte superior. |
| `showReports` | `boolean` | Conmuta la visibilidad de la capa de reportes. |
| `showNews` | `boolean` | Conmuta la visibilidad de la capa de noticias. |
| `selectedStatuses` | `string[]` | Guarda los estados seleccionados para filtrar reportes. |
| `selectedDateRange` | `string` | Guarda el rango temporal de filtrado. |
| `isHeatmapVisible` | `boolean` | Alterna entre vista de marcadores puntuales y mapa de calor. |
| `activeBaseMap` | `'voyager' \| 'light' \| 'satellite'` | Identifica el mapa base activo. |
| `mapRef` | `L.Map \| null` | Guarda la referencia directa a la instancia de la API de Leaflet. |

---

## 29. Uso de `useEffect` en la gestión del mapa

1. **Carga inicial de datos (`useEffect`)**: Ejecuta las consultas asíncronas a Supabase al montar el componente.
2. **Invalidación de tamaño del mapa (`useEffect`)**: Llama a `mapRef.invalidateSize()` cuando el panel lateral se abre o cierra, corrigiendo cualquier deformación en el canvas de Leaflet tras transiciones CSS.
3. **Control de scroll de la página (`useEffect`)**: Bloquea el scroll general del `body` en la ruta `/mapa` para que los gestos táctiles del usuario interactúen exclusivamente con la navegación del mapa.

---

## 30. Flujo completo al abrir el mapa (`/mapa`)

```text
1. El usuario navega a la URL /mapa
                 │
                 ▼
2. Next.js ejecuta app/mapa/page.tsx
                 │
                 ▼
3. Carga dinámica MapClient.tsx (ssr: false desactiva SSR)
                 │
                 ▼
4. Se renderiza la pantalla de carga visual (Spinner)
                 │
                 ▼
5. El navegador descarga el bundle e instancia MapView.tsx
                 │
                 ▼
6. Leaflet crea el MapContainer centrado en Asunción [-25.2855, -57.6150]
                 │
                 ▼
7. TileLayer descarga los mosaicos cartográficos (CARTO Light)
                 │
                 ▼
8. useEffect en MapView.tsx realiza SELECT a Supabase (reportes y noticias_historicas)
                 │
                 ▼
9. useMemo aplica los filtros en memoria y asigna los datos
                 │
                 ▼
10. Leaflet dibuja los marcadores (ReportMarker / NewsMarker) sobre el mapa
```

---

## 31. Relación entre tecnologías

| Tecnología | Responsabilidad específica en la arquitectura |
| :--- | :--- |
| **Next.js** | Enrutamiento de páginas (`/mapa`), gestión de metadatos SEO y carga dinámica de componentes cliente (`dynamic`). |
| **React** | Administración del estado de la aplicación (`useState`), procesamiento en memoria (`useMemo`) y reactividad de componentes UI. |
| **Supabase** | Backend de base de datos relacional y API de consulta para proveer los datos de reportes y noticias. |
| **PostgreSQL** | Motor relacional de base de datos que almacena las coordenadas `float8` y atributos de las tablas. |
| **React Leaflet** | Componentes declarativos (`<MapContainer>`, `<TileLayer>`, `<Marker>`, `<Popup>`) que conectan React con Leaflet. |
| **Leaflet** | Motor cartográfico nativo JS que dibuja mosaicos, calcula proyecciones en pantalla y gestiona la interacción del mapa. |

---

## 32. Inventario de archivos del proyecto involucrados en el mapa

| Archivo | Ruta física | Responsabilidad principal |
| :--- | :--- | :--- |
| Página Mapa | [`app/mapa/page.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/app/mapa/page.tsx) | Punto de entrada de la ruta `/mapa`. |
| MapClient | [`src/components/MapClient.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapClient.tsx) | Wrapper de carga dinámica cliente con `ssr: false`. |
| MapView | [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx) | Componente central del mapa, consultas a Supabase y gestión de estados. |
| ReportMarker | [`src/components/ReportMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportMarker.tsx) | Componente de marcador e icono SVG para reportes ciudadanos. |
| NewsMarker | [`src/components/NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx) | Componente de marcador e icono SVG para noticias históricas. |
| FilterPanel | [`src/components/FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx) | Panel flotante de controles de mapas base, fechas y categorías. |
| SidebarReports | [`src/components/SidebarReports.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SidebarReports.tsx) | Lista desplegable lateral para explorar incidencias. |
| SearchBar | [`src/components/SearchBar.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SearchBar.tsx) | Barra de búsqueda de ubicaciones con integración Nominatim API. |
| HeatmapLayer | [`src/components/HeatmapLayer.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/HeatmapLayer.tsx) | Capa analítica de densidad de calor basada en `leaflet.heat`. |
| CustomZoomControl | [`src/components/CustomZoomControl.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/CustomZoomControl.tsx) | Botones flotantes personalizados para Zoom In / Zoom Out. |

---

## 33. Guía práctica para modificar el mapa

* **Si quiero cambiar el mapa base por defecto**: Modifica la constante `activeBaseMap` en [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L51).
* **Si quiero cambiar el icono o diseño de los reportes**: Modifica [`src/components/ReportMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportMarker.tsx).
* **Si quiero cambiar el icono o popup de las noticias**: Modifica [`src/components/NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx).
* **Si quiero agregar nuevas opciones al panel de filtros**: Modifica [`src/components/FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx).
* **Si quiero ajustar la barra de búsqueda o el proveedor de geocodificación**: Modifica [`src/components/SearchBar.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SearchBar.tsx).
* **Si quiero cambiar las consultas de datos a la base de datos**: Modifica el `useEffect` en [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx#L127-L203).

---

## 34. Manejo de errores implementado

1. **Fallo en consulta de Supabase**: Si la conexión con Supabase falla o la tabla `reportes` retorna un error, la aplicación captura la excepción en un bloque `try/catch` en `MapView.tsx` y realiza un fallback a `mockReports` para evitar que la interfaz del mapa colapse.
2. **Coordenadas inválidas en Noticias**: En `MapView.tsx:173-181`, el sistema ejecuta un filtro de validación que descarta registros donde `latitud` o `longitud` sean nulos, vacíos o `NaN`.
3. **Imágenes ausentes**: Si un registro no contiene `imagen_url`, los componentes de Popup omiten la etiqueta `<img>` sin generar un error de renderizado.
4. **Sin resultados en búsqueda**: `SearchBar.tsx` detecta cuando la API de Nominatim no retorna resultados y despliega una notificación limpia dentro del menú desplegable.

---

## 35. Estado actual de la implementación

### Implementado y Operativo:
* Integración con Leaflet y React Leaflet con mapa base dinámico (CARTO / Esri).
* Despliegue dinámico de 32 noticias históricas leídas desde Supabase.
* Formulario e infraestructura para reportes ciudadanos listos para registrar eventos.
* Búsqueda de lugares mediante OpenStreetMap Nominatim.
* Geolocalización GPS del usuario.
* Capa de mapa de calor (`HeatmapLayer`).
* Panel de filtros dinámicos en memoria (`useMemo`).

### No Encontrado / No Utilizado en el mapa actual:
* No se utilizan plugins de clustering (`react-leaflet-cluster`) en la versión actual.
* No se encontraron capas de polígonos GeoJSON activos en la vista principal del mapa.

---

## 36. Posibles mejoras futuras

* **Agrupamiento de marcadores (Clustering)**: Incorporar `Leaflet.markercluster` para agrupar marcadores cuando existan cientos de reportes ciudadanos en una misma manzana.
* **Capas GeoJSON de cuencas e hídrica**: Cargar vectores poligonales de las cuencas de los arroyos de Asunción (arroyo Jaén, Mburicaó, Itay).
* **Filtrado por radio espacial**: Permitir al usuario definir un círculo de interés (ej: 1 km a la redonda) para recibir o ver reportes.

---

## 37. Ayuda memoria

```text
================================================================================
                               AYUDA MEMORIA
================================================================================
• Leaflet       -> Biblioteca motor del mapa cartográfico interactivo.
• React Leaflet -> Envuelve Leaflet en componentes React (<MapContainer>, etc.).
• MapContainer  -> Contenedor principal donde se dibuja el lienzo del mapa.
• TileLayer     -> Capa de mosaicos o azulejos que forman el mapa de fondo.
• Marker        -> Marcador puntual dibujado en una coordenada [lat, lng].
• Popup         -> Ventana de información flotante al hacer clic en un marcador.
• MapClient.tsx -> Carga dinámicamente el mapa con ssr: false para evitar errores.
• MapView.tsx   -> Componente central donde convergen Supabase, filtros y Leaflet.
• Nominatim     -> Servicio de OpenStreetMap usado para la barra de búsqueda.
================================================================================
```

---

## 38. Preguntas clave para la defensa de tesis

### ¿Por qué utilizaron Leaflet en lugar de Google Maps?
Leaflet es una biblioteca ligera, de código abierto, sin restricciones de API Key comercial ni costos por consumo de mosaicos, lo que garantiza la sostenibilidad del proyecto.

### ¿Qué diferencia hay entre Leaflet y React Leaflet?
Leaflet es una librería de JavaScript imperativa que manipula directamente el DOM. React Leaflet es una capa de abstracción declarativa que permite utilizar la API de Leaflet dentro de la arquitectura de componentes de React.

### ¿Por qué se utilizó `ssr: false` en la carga del mapa?
Porque Leaflet interactúa de forma nativa con los objetos `window` y `document` del navegador web. Desactivar el Server-Side Rendering (SSR) evita que Next.js intente ejecutar Leaflet en el servidor de Node.js donde esos objetos no existen.

### ¿Cómo llegan los datos desde Supabase hasta el mapa?
Al cargar la página, `MapView.tsx` realiza una consulta `SELECT` con el SDK de Supabase, obtiene las coordenadas numéricas `latitud` y `longitud` (`float8`), las mapea en el estado de React y se las pasa como prop `position={[lat, lng]}` al componente `<Marker>` de React Leaflet.

---

## 39. Resumen del Flujo de Datos

```text
 ┌────────────────────────┐
 │   BASE DE DATOS        │  (PostgreSQL en Supabase: reportes y noticias_historicas)
 └───────────┬────────────┘
             │
             ▼
 ┌────────────────────────┐
 │      SUPABASE SDK      │  (Petición SELECT asíncrona)
 └───────────┬────────────┘
             │
             ▼
 ┌────────────────────────┐
 │   NEXT.JS / REACT UI   │  (MapView.tsx procesa estados y aplica useMemo)
 └───────────┬────────────┘
             │
             ▼
 ┌────────────────────────┐
 │     REACT LEAFLET      │  (Componentes <MapContainer>, <TileLayer>, <Marker>)
 └───────────┬────────────┘
             │
             ▼
 ┌────────────────────────┐
 │      LEAFLET JS        │  (Renderizado final de mosaicos, marcadores y popups)
 └───────────┬────────────┘
```
