# CAPÍTULO 11 · FILTROS, SIDEBAR E INTERACCIÓN DE LA INTERFAZ

## 1. ¿QUÉ ES UN FILTRO?

Un **filtro** es un mecanismo de control de interfaz y lógica de software que permite a los usuarios seleccionar un subconjunto específico de información a partir de un conjunto de datos más amplio. En lugar de procesar y desplegar la totalidad de los datos registrados, el filtro aplica una serie de condiciones lógicas (criterios de inclusión o exclusión) para mostrar únicamente los registros que satisfacen dichos parámetros.

En el contexto de la **Plataforma de Monitoreo de Inundaciones del Área Metropolitana de Asunción**, un filtro opera directamente sobre las fuentes de información geográfica (reportes ciudadanos en tiempo real y noticias históricas de inundaciones). 

Por ejemplo, si la base de datos contiene 100 eventos georreferenciados (combinando noticias de prensa e incidencias comunitarias), el usuario puede aplicar un filtro de fuente desactivando la opción de *"Reportes ciudadanos"*. Al hacerlo, la interfaz filtra el conjunto global y muestra exclusivamente los marcadores correspondientes a *"Noticias históricas"*, reduciendo el ruido visual en la pantalla y focalizando la atención en los datos deseados.

---

## 2. ¿POR QUÉ NECESITAMOS FILTROS?

Los sistemas de información geográfica (SIG) dedicados a la gestión de emergencias y monitoreo hidrológico manejan una alta densidad y diversidad de datos espaciotemporales:

1. **Saturación y solapamiento visual (*Cluttering*):** En zonas urbanas densas como Asunción, la superposición de decenas o cientos de marcadores puntuales dificulta la lectura individual de los eventos, imposibilitando la identificación de patrones puntuales.
2. **Diversidad de fuentes y naturaleza de datos:** Los datos integrados provienen de fuentes disímiles; por un lado, observaciones históricas documentadas por medios de prensa (`noticias_historicas`) y, por otro, alertas en tiempo real enviadas por la ciudadanía (`reportes`). Mezclar ambas sin control en una sola capa puede confundir el análisis situacional.
3. **Variabilidad en el estado de validación:** Los reportes de ciudadanos pueden estar en estado *pendiente* de verificación, *validado* por administradores, o *descartado/rechazado*. Para la toma de decisiones institucionales o de seguridad ciudadana, es fundamental poder aislar los datos verificados de los pendientes.
4. **Dimensión temporal:** Las inundaciones severas están ligadas a eventos hidrometeorológicos específicos. Permitir filtrar por rangos temporales (hoy, últimos 7 días, últimos 30 días o todo el registro) resulta crítico para aislar emergencias actuales de antecedentes pasados.

Sin filtros interactivos, el mapa interactivo resultaría ilegible e ineficaz para la gestión de riesgos de anegamiento urbanos.

---

## 3. SIDEBAR (PANEL DE REPORTES Y PANEL DE FILTROS)

En la plataforma actual, la interacción del panel lateral está dividida en dos componentes con responsabilidades claramente separadas, coordinados por la vista principal del mapa:

### Componente del Sidebar de Reportes (`SidebarReports.tsx`)
* **Ruta real:** [`my-app/src/components/SidebarReports.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SidebarReports.tsx)
* **Responsabilidad:** Presenta un panel lateral desplegable que lista visualmente las tarjetas de reportes ciudadanos filtrados. Muestra detalles como tipo de afectaciones, estado del reporte, descripción, ubicación y fecha/hora. Permite la interactividad cruzada: al hacer clic en un reporte de la lista, el mapa centra automáticamente la vista (`setView`) en la coordenada correspondiente.
* **Carga e integración:** Es importado y renderizado dinámicamente por `MapView.tsx`.
* **Relación con el mapa:** Recibe la lista procesada de `filteredReports` y el callback `onSelectReport`.

### Componente del Panel de Filtros / Visualización (`FilterPanel.tsx`)
* **Ruta real:** [`my-app/src/components/FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx)
* **Responsabilidad:** Funciona como un panel flotante/desplegable situado en el extremo superior derecho del mapa. Agrupa los controles interactivos (checkboxes, radio buttons, acordeones y botones de opción) mediante los cuales el usuario modifica el estado global de filtrado de la aplicación.
* **Carga e integración:** Importado y renderizado en `MapView.tsx`.

```tsx
// Fragmento de integración en MapView.tsx
<div className={`fixed md:relative top-0 left-0 h-full z-[2000] md:z-10 ...`}>
  <SidebarReports 
    reports={filteredReports} 
    onSelectReport={handleSelectReportFromSidebar} 
    onCollapse={() => setIsSidebarOpen(false)}
  />
</div>
```

---

## 4. ESTRUCTURA DEL SIDEBAR Y CONTROLES

La estructura visual e interactiva de los componentes de interacción lateral y flotante implementados en el código real se organiza de la siguiente manera:

```text
INTERFAZ DE MAPA (MapView.tsx)
│
├── SIDEBAR DE REPORTES (SidebarReports.tsx)
│   ├── Encabezado (Título, contador de reportes visibles, botón cerrar/contraer)
│   └── Lista Desplazable de Tarjetas (sidebar-scrollable)
│       ├── Etiquetas de Afectación (impactTags)
│       ├── Indicador de Estado (status: pendiente / validado)
│       ├── Descripción del Reporte (description)
│       └── Ubicación y Fecha (dateTime)
│
└── PANEL DE VISUALIZACIÓN Y FILTROS (FilterPanel.tsx)
    ├── Encabezado Flotante / Botón Toggle (Visualización)
    └── Contenido Desplegable (filter-scrollable)
        ├── Acordeón: DATOS (Checkboxes: Reportes ciudadanos, Noticias históricas)
        ├── Acordeón: MAPA BASE (Radio buttons: Mapa, Calles, Satélite)
        ├── Acordeón: ESTADO (Checkboxes: Pendientes, Verificados, Descartados)
        ├── Acordeón: FECHA (Botones: Todo, Hoy, Últimos 7 días, Últimos 30 días)
        ├── Acordeón: AFECTACIONES (Checkboxes: Categorías de impacto ambiental/urbano)
        └── Acordeón: OPCIONES (Switch Toggle: Mapa de Calor / Heatmap)
```

---

## 5. FILTROS IMPLEMENTADOS

A continuación se detallan la totalidad de los filtros activos en el código fuente del proyecto (`MapView.tsx` y `FilterPanel.tsx`):

| Filtro | Control de UI | Estado React Asociado | Efecto en la Aplicación |
| :--- | :--- | :--- | :--- |
| **Fuentes (Reportes)** | Checkbox (`input type="checkbox"`) | `showReports: boolean` | Activa o desactiva la visibilidad de los marcadores de reportes ciudadanos en el mapa y en el sidebar. |
| **Fuentes (Noticias)** | Checkbox (`input type="checkbox"`) | `showNews: boolean` | Activa o desactiva la visibilidad de las noticias históricas de prensa georreferenciadas. |
| **Estado de Reportes** | Checkboxes independientes | `selectedStatuses: string[]` | Filtra los reportes según su estado en Supabase (`pendiente`, `validado`, `rechazado`). |
| **Rango de Fecha** | Botones de selección rápida | `selectedDateRange: string` | Filtra eventos por antigüedad temporal (`todo`, `hoy`, `7dias`, `30dias`). |
| **Afectaciones / Tags** | Checkboxes con scroll vertical | `selectedTags: string[]` | Filtra reportes por categorías de daño (`Calle inundada`, `Árbol caído`, `Vivienda afectada`, etc.). |
| **Mapa de Calor** | Switch Toggle (peer-checked) | `isHeatmapVisible: boolean` | Oculta marcadores puntuales y renderiza una capa continua de intensidad térmica (`HeatmapLayer`). |
| **Mapa Base** | Radio buttons (`input type="radio"`) | `activeBaseMap: string` | Cambia las baldosas (*tiles*) de Leaflet (`light`, `voyager`, `satellite`). |

---

## 6. FILTROS DE FUENTE

El sistema permite diferenciar explícitamente entre dos orígenes de datos: los reportes ciudadanos registrados mediante la app (`reportes`) y los registros históricos de eventos pasados recuperados de medios de prensa (`noticias_historicas`).

En `FilterPanel.tsx`, la sección **DATOS** expone dos controles checkbox:

```tsx
<input 
  type="checkbox" 
  checked={showReports}
  onChange={(e) => onShowReportsChange(e.target.checked)}
/>
<input 
  type="checkbox" 
  checked={showNews}
  onChange={(e) => onShowNewsChange(e.target.checked)}
/>
```

En `MapView.tsx`, las memorizaciones `useMemo` evalúan estos estados booleanos antes de procesar el arreglo:
* Si `showReports` es `false`, `filteredReports` retorna inmediatamente un arreglo vacío `[]`.
* Si `showNews` es `false`, `filteredNews` retorna inmediatamente `[]`.

---

## 7. FILTRO DE ESTADO

En la base de datos de Supabase, la tabla `reportes` posee la columna `estado`. Los valores reales manejados por el tipo de TypeScript `Report['status']` son:
* `'pendiente'` (reportes enviados por ciudadanos aún no validados).
* `'validado'` (reportes verificados por administradores).
* `'rechazado'` (reportes descartados o inconsistentes).

En `MapView.tsx`, el estado inicial se define con las tres opciones activas:
```tsx
const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['pendiente', 'validado', 'rechazado']);
```

Cuando el usuario interactúa con un checkbox de estado en `FilterPanel.tsx`, la función `handleStatusToggle` agrega o quita el string correspondiente del arreglo `selectedStatuses`. Durante el cálculo de `filteredReports`, se verifica:
```tsx
const matchStatus = selectedStatuses.includes(report.status);
```
Si el estado del reporte no se encuentra en `selectedStatuses`, el reporte es excluido del mapa y del panel lateral.

---

## 8. FILTROS DE AFECTACIONES Y CATEGORÍAS (NOTICIAS Y REPORTES)

Actualmente en el sistema, las categorías de impacto ambiental y urbano se gestionan mediante el arreglo de etiquetas `impactTags` en los reportes (mapeado de la columna `afectaciones` en la tabla `reportes` de Supabase).

Las 10 etiquetas oficiales disponibles en `FilterPanel.tsx` son:
```typescript
const AVAILABLE_TAGS = [
  'Calle inundada',
  'Deslizamiento',
  'Árbol caído',
  'Vivienda afectada',
  'Vehículo afectado',
  'Persona atrapada',
  'Sin daños visibles',
  'Interrupción de tránsito',
  'Servicio público afectado',
  'Fallecimiento reportado'
];
```

En la lógica de filtrado de `MapView.tsx`, si el usuario selecciona una o más etiquetas en `selectedTags`, el reporte solo se muestra si posee al menos una de las etiquetas seleccionadas (`some`):
```tsx
const matchTags = selectedTags.length === 0 || 
  (report.impactTags && report.impactTags.some(tag => selectedTags.includes(tag)));
```

*Nota sobre Noticias Históricas:* Las noticias históricas poseen campos como `titulo`, `resumen`, `medio`, `url` y `fecha_publicacion`. Actualmente el filtro por etiquetas se aplica a la lista de reportes ciudadanos, mientras que las noticias responden al filtro de rango de fecha y visibilidad de fuente.

---

## 9. FILTRO POR FECHA

El filtro temporal está implementado mediante un selector de rango con 4 opciones discretas:
1. `'todo'`: Muestra la totalidad de los registros sin restricción de fecha.
2. `'hoy'`: Filtra eventos cuyo timestamp sea mayor o igual a las 00:00:00 del día actual.
3. `'7dias'`: Filtra eventos ocurridos en los últimos 7 días ($7 \times 24 \text{ horas}$).
4. `'30dias'`: Filtra eventos ocurridos en los últimos 30 días ($30 \times 24 \text{ horas}$).

### Lógica de Comparación de Fechas en `MapView.tsx`

```tsx
let matchDate = true;
if (selectedDateRange !== 'todo') {
  const dateVal = report.dateTime ? new Date(report.dateTime) : null;
  if (!dateVal || isNaN(dateVal.getTime())) {
    matchDate = false;
  } else {
    const now = new Date();
    if (selectedDateRange === 'hoy') {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      matchDate = dateVal >= startOfToday;
    } else if (selectedDateRange === '7dias') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchDate = dateVal >= sevenDaysAgo;
    } else if (selectedDateRange === '30dias') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchDate = dateVal >= thirtyDaysAgo;
    }
  }
}
```
Esta misma lógica matemática se aplica idénticamente para filtrar el arreglo de noticias históricas `news` en la memoria computable `filteredNews`.

---

## 10. FUNCIONAMIENTO DE CHECKBOXES EN REACT

Un **Checkbox** en React es un componente de entrada (`<input type="checkbox" />`) cuyo estado de activación (*checked*) está enlazado a un valor booleano o a la presencia de un elemento en un arreglo dentro del estado de React.

### Flujo Fundamental:
1. **Representación visual:** El atributo `checked={valorBooleano}` determina si la casilla aparece marcada o desmarcada.
2. **Captura del evento:** Cuando el usuario hace clic en la casilla, el navegador dispara el evento `onChange`.
3. **Notificación al padre:** El evento ejecuta la función callback pasada por props (ej. `onShowReportsChange(e.target.checked)`).
4. **Actualización de estado:** La función actualizadora de React (`setShowReports`) re-renderiza el componente con el nuevo valor.

---

## 11. ACORDEONES Y SECCIONES DESPLEGABLES

Para optimizar el espacio en pantallas pequeñas y mantener una interfaz limpia, `FilterPanel.tsx` implementa **acordeones** (secciones colapsables).

El estado interno que controla la apertura y cierre de las 6 secciones es:
```tsx
const [expandedSections, setExpandedSections] = useState({
  datos: true,
  mapaBase: true,
  estado: true,
  fecha: false,
  afectaciones: false,
  opciones: false
});
```

Al hacer clic en el encabezado de una sección, la función `toggleSection('seccion')` invierte el booleano correspondiente. En el JSX, la visibilidad se logra mediante transiciones CSS dinámicas de altura y opacidad:

```tsx
<div className={`overflow-hidden transition-all duration-300 ease-in-out ${
  expandedSections.datos ? 'max-h-24 opacity-100 mt-2.5 pl-6' : 'max-h-0 opacity-0'
}`}>
```

---

## 12. `useState` Y ESTADOS DE FILTRADO

El Hook `useState` de React permite declarar variables de estado que persisten entre renderizados y cuya modificación desencadena la actualización del DOM.

En `MapView.tsx`, los estados principales relacionados con los filtros y la interfaz lateral son:

| Estado | Tipo / Valor Inicial | Función en la Aplicación |
| :--- | :--- | :--- |
| `reports` | `Report[]` (`[]`) | Almacena los reportes crudos obtenidos desde Supabase. |
| `news` | `NoticiaHistorica[]` (`[]`) | Almacena las noticias históricas obtenidas desde Supabase. |
| `showReports` | `boolean` (`true`) | Define si se procesa y muestra la capa de reportes ciudadanos. |
| `showNews` | `boolean` (`true`) | Define si se procesa y muestra la capa de noticias históricas. |
| `selectedStatuses` | `string[]` (`['pendiente', 'validado', 'rechazado']`) | Lista de estados de reporte permitidos en el mapa. |
| `selectedDateRange` | `string` (`'todo'`) | Rango de tiempo seleccionado (`todo`, `hoy`, `7dias`, `30dias`). |
| `selectedTags` | `string[]` (`[]`) | Arreglo de etiquetas de afectación activas para filtrar. |
| `isHeatmapVisible` | `boolean` (`false`) | Alterna entre vista de marcadores puntuales y capa térmica. |
| `activeBaseMap` | `'light' \| 'voyager' \| 'satellite'` (`'light'`) | Define el proveedor de baldosas de Leaflet (`BASE_MAPS`). |
| `isSidebarOpen` | `boolean` (`true` en desktop, `false` en móvil) | Controla si el panel lateral de reportes está abierto o colapsado. |

---

## 13. MANEJO DE EVENTOS EN LA INTERFAZ

La interacción entre el usuario y la interfaz se gestiona mediante controladores de eventos de React:

* `onClick`: Capturado al hacer clic en botones (ej. alternar acordeones, seleccionar rango de fecha, abrir/cerrar sidebar, hacer clic en una tarjeta de reporte).
* `onChange`: Capturado al modificar el valor de un `<input type="checkbox">` o `<input type="radio">`.

### Flujo de Ejecución de Eventos:
$$\text{Usuario interactúa con UI} \longrightarrow \text{Disparo de } \text{onChange}/\text{onClick} \longrightarrow \text{Ejecución de Callback Props} \longrightarrow \text{Actualización de } \text{useState} \longrightarrow \text{Re-calculo de } \text{useMemo} \longrightarrow \text{Re-renderizado en Leaflet}$$

---

## 14. FILTRADO DE ARRAYS EN JAVASCRIPT / REACT (`.filter()`)

El método `.filter()` de JavaScript crea un nuevo arreglo con todos los elementos que cumplan con la condición implementada por la función dada.

### Código Real de Filtrado en `MapView.tsx`:

```tsx
const filteredReports = useMemo(() => {
  if (!showReports) return [];
  return reports.filter(report => {
    // 1. Filtro por afectaciones (Tags)
    const matchTags = selectedTags.length === 0 || 
      (report.impactTags && report.impactTags.some(tag => selectedTags.includes(tag)));

    // 2. Filtro por estado del reporte
    const matchStatus = selectedStatuses.includes(report.status);

    // 3. Filtro por fecha
    let matchDate = true;
    if (selectedDateRange !== 'todo') {
      // Lógica de validación de fecha...
    }

    return matchTags && matchStatus && matchDate;
  });
}, [reports, showReports, selectedTags, selectedStatuses, selectedDateRange]);
```

El uso de `useMemo` garantiza que la función `.filter()` únicamente se vuelva a ejecutar cuando cambie alguno de sus estados dependientes (`reports`, `showReports`, `selectedTags`, `selectedStatuses`, `selectedDateRange`), optimizando el rendimiento.

---

## 15. FLUJO COMPLETO DE UN FILTRO

A continuación se rastrea el flujo completo paso a paso desde que el usuario desmarca la opción *"Pendientes"* en el filtro de estado:

```text
1. USUARIO: Desmarca el checkbox "Pendientes" en FilterPanel.tsx.
   ↓
2. EVENTO: Se dispara onChange en el input del checkbox.
   ↓
3. CALLBACK: Executa handleStatusToggle('pendiente') en FilterPanel.tsx.
   ↓
4. PROPS: Se invoca onStatusesChange(['validado', 'rechazado']) recibida desde MapView.tsx.
   ↓
5. ESTADO: MapView ejecuta setSelectedStatuses(['validado', 'rechazado']).
   ↓
6. MEMOIZATION: useMemo detecta el cambio en selectedStatuses y re-ejecuta el .filter() sobre reports.
   ↓
7. RESULTADO: filteredReports excluye todos los reportes con status === 'pendiente'.
   ↓
8. RE-RENDER: MapView se re-renderiza con la nueva lista filteredReports.
   ↓
9. SIDEBAR: SidebarReports recibe la nueva lista y actualiza la cantidad de tarjetas visibles.
   ↓
10. LEAFLET: El mapa desmonta los marcadores <ReportMarker> eliminados y conserva únicamente los validados/rechazados.
```

---

## 16. PROPS Y COMUNICACIÓN ENTRE COMPONENTES

Las **props** (propiedades) permiten transmitir datos y funciones callback desde un componente padre hacia sus componentes hijos.

### Props enviadas desde `MapView.tsx` a `FilterPanel.tsx`:
```tsx
<FilterPanel 
  showReports={showReports}
  onShowReportsChange={setShowReports}
  showNews={showNews}
  onShowNewsChange={setShowNews}
  selectedStatuses={selectedStatuses}
  onStatusesChange={setSelectedStatuses}
  selectedDateRange={selectedDateRange}
  onDateRangeChange={setSelectedDateRange}
  selectedTags={selectedTags}
  onTagsChange={setSelectedTags}
  isHeatmapVisible={isHeatmapVisible}
  onToggleHeatmap={setIsHeatmapVisible}
  activeBaseMap={activeBaseMap}
  onChangeBaseMap={setActiveBaseMap}
/>
```

---

## 17. ARQUITECTURA DEL COMPONENTE PADRE

El componente `MapView.tsx` actúa como el **componente padre y orquestador central**. Administra el estado global de la vista de mapa y coordina la comunicación unidireccional de datos (*Top-Down Data Flow*) hacia sus componentes hijos.

```text
                     MapView.tsx (Componente Padre)
                     [Mantiene el Estado Global]
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
 SidebarReports.tsx       FilterPanel.tsx         MapContainer (Leaflet)
 (Recibe: reports,        (Recibe: estados,       (Recibe: filteredReports,
  onSelectReport)          on...Change callbacks)  filteredNews, Heatmap)
```

---

## 18. INTEGRACIÓN DE FILTROS CON LEAFLET

Leaflet opera de forma declarativa dentro del ciclo de vida de React gracias a la librería `react-leaflet`:

1. **Datos originales (`reports`, `news`):** Arreglos completos almacenados en el estado tras la consulta a Supabase.
2. **Datos filtrados (`filteredReports`, `filteredNews`):** Arreglos derivados calculados por `useMemo`.
3. **Renderizado en mapa:**
```tsx
{!isHeatmapVisible && filteredReports.map(report => (
  <ReportMarker key={report.id} report={report} />
))}

{!isHeatmapVisible && filteredNews.map(noticia => (
  <NewsMarker key={`news-${noticia.id}`} news={noticia} />
))}

<HeatmapLayer 
  reports={filteredReports} 
  isVisible={isHeatmapVisible} 
/>
```
Si un objeto se elimina de `filteredReports`, React desmonta el componente `<ReportMarker>` correspondiente, lo que provoca que Leaflet elimine el marcador del mapa sin necesidad de manipular manualmente la API imperativa de Leaflet.

---

## 19. TRATAMIENTO DE REPORTES CIUDADANOS Y FILTROS

Los reportes ciudadanos provienen de la tabla `reportes` de Supabase. Poseen coordenadas (`latitud`, `longitud`), descripción, fotografías y una lista de etiquetas de afectaciones.

* **Filtros aplicables:** Visibilidad de datos, Estado (`pendiente`, `validado`, `rechazado`), Rango de fecha, Etiquetas de afectación (`impactTags`), y Mapa de calor.
* **Comportamiento ante base de datos vacía o error de red:** El sistema implementa un mecanismo de fallback (*mockReports*) en `MapView.tsx` para garantizar que la interfaz mantenga su funcionalidad interactiva aun cuando no existan registros en la base de datos remota.

---

## 20. TRATAMIENTO DE NOTICIAS HISTÓRICAS Y FILTROS

Las noticias históricas provienen de la tabla `noticias_historicas` de Supabase.

* **Filtros aplicables:** Visibilidad de fuentes (checkbox *"Noticias históricas"*) y Rango de fecha (`selectedDateRange`).
* **Validación espacial:** En `MapView.tsx`, al recuperar los registros de noticias, se realiza un filtrado previo asegurando que `latitud` y `longitud` sean números válidos (`!isNaN`) antes de agregarlos al estado `news`.

---

## 21. OTROS CONTROLES DE LA INTERFAZ DEL MAPA

Además del panel de filtros, la interfaz cuenta con otros controles especializados:

1. **Control de Zoom Personalizado (`CustomZoomControl.tsx`):** [`my-app/src/components/CustomZoomControl.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/CustomZoomControl.tsx)
   Botonera flotante en la esquina inferior derecha (+ / -) que invoca `mapRef.zoomIn()` y `mapRef.zoomOut()`.
2. **Selector de Mapa Base (TileLayer):** Permite alternar entre mapas CartoDB Light, CartoDB Voyager y Esri World Imagery (Satélite).
3. **Capa de Mapa de Calor (`HeatmapLayer.tsx`):** [`my-app/src/components/HeatmapLayer.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/HeatmapLayer.tsx)
   Usa la librería `leaflet.heat` para calcular la densidad de eventos e intensidad según la cantidad de afectaciones reportadas.

---

## 22. INTEGRACIÓN CON EL COMPONENTE DE BÚSQUEDA (`SearchBar.tsx`)

El componente de búsqueda está disponible en [`my-app/src/components/SearchBar.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SearchBar.tsx).

* **Funcionamiento:** Utiliza la API de geocodificación de Nominatim (OpenStreetMap) restringida a Paraguay (`countrycodes=py`).
* **Interacción con el Mapa:** Al seleccionar un resultado de búsqueda, invoca la función callback `handleSelectLocation(lat, lon)` en `MapView.tsx`, la cual ejecuta:
```tsx
mapRef.flyTo([lat, lon], 16, { animate: true, duration: 1.5 });
```
Esto vuela suavemente la cámara del mapa hacia la dirección o punto de interés seleccionado por el usuario.

---

## 23. COMPORTAMIENTO ANTE ESTADOS VACÍOS (*EMPTY STATES*)

Cuando la combinación de filtros aplicada por el usuario resulta en 0 coincidencias:

1. **Comportamiento en el Mapa:** Todos los marcadores `<ReportMarker>` y `<NewsMarker>` son desmontados. El mapa permanece limpio y totalmente interactivo.
2. **Comportamiento en el Sidebar (`SidebarReports.tsx`):** El contador de eventos muestra `0 eventos registrados`. El área desplazable renderiza una vista de estado vacío con un icono de advertencia y el mensaje explícito:
   *"No se encontraron reportes con los filtros seleccionados."*

```tsx
{reports.length === 0 && (
  <div className="flex flex-col items-center justify-center text-center text-slate-400 mt-16 p-6">
    <AlertTriangle size={32} className="mb-3 opacity-20" />
    <p className="text-sm">No se encontraron reportes con los filtros seleccionados.</p>
  </div>
)}
```

---

## 24. RESET DE FILTROS

En la implementación actual, los filtros restablecen sus valores por defecto al recargar la página o pueden ser reajustados manualmente desmarcando los controles en `FilterPanel.tsx`. 

*Propuesta de Mejora:* Se puede incorporar un botón de *"Limpiar Filtros"* en el encabezado de `FilterPanel.tsx` que reinicie los estados a sus valores por omisión (`setSelectedTags([])`, `setSelectedDateRange('todo')`, `setSelectedStatuses(['pendiente', 'validado', 'rechazado'])`, `setShowReports(true)`, `setShowNews(true)`).

---

## 25. COMPORTAMIENTO RESPONSIVO (DISEÑO MÓVIL Y DESKTOP)

La interfaz adapte su comportamiento dinámicamente según el tamaño de la pantalla mediante Hooks de React y clases de Tailwind CSS:

* **En pantallas móviles (`< 768px`):**
  * El sidebar de reportes se oculta por defecto (`setIsSidebarOpen(false)` en `useEffect`).
  * Al abrirse, el sidebar se superpone a pantalla completa con un fondo semitransparente oscuro (`backdrop-blur-sm`).
  * Aparece un botón flotante inferior *"Ver Reportes"* / *"Cerrar Lista"*.
  * El panel de filtros adopta un ancho de `calc(100vw - 2rem)` y se inicia colapsado para no obstruir el mapa.
* **En pantallas desktop (`>= 768px`):**
  * El sidebar permanece abierto lateralmente ajustando el tamaño del canvas del mapa (`mapRef.invalidateSize()`).
  * El panel de filtros se inicia desplegado (`isExpanded = true`).

---

## 26. DIAGRAMA DE FLUJO GENERAL DE INTERACCIÓN

```text
USUARIO
  │
  ├──────► INTERACTÚA CON CONTROLES (FilterPanel.tsx / SearchBar.tsx)
  │            │
  │            ▼
  │        EVENTOS DE REACT (onChange / onClick)
  │            │
  │            ▼
  │        ACTUALIZACIÓN DE ESTADOS (useState en MapView.tsx)
  │            │
  │            ▼
  │        RE-CÁLCULO MEMORIZADO (useMemo: filteredReports, filteredNews)
  │            │
  │            ├───────────────────────────────┐
  │            ▼                               ▼
  │     SIDEBAR DE REPORTES              CAPA DE LEAFLET
  │     (SidebarReports.tsx)            (MapContainer / Markers)
  │            │                               │
  └────────────┴───────────────┬───────────────┘
                               ▼
                    RESULTADO VISUAL EN PANTALLA
```

---

## 27. TABLA DE ARCHIVOS INVOLUCRADOS EN LA INTERFAZ Y FILTROS

| Archivo | Ruta Relativa | Responsabilidad Principal |
| :--- | :--- | :--- |
| **`MapView.tsx`** | [`my-app/src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx) | Componente padre. Administra estados globales de filtrado, consulta Supabase, computa arreglos filtrados y renderiza Leaflet. |
| **`FilterPanel.tsx`** | [`my-app/src/components/FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx) | Panel flotante de UI con acordeones, checkboxes, radio buttons y switches para ajustar los filtros. |
| **`SidebarReports.tsx`** | [`my-app/src/components/SidebarReports.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SidebarReports.tsx) | Panel lateral que despliega la lista interactiva de reportes filtrados. |
| **`SearchBar.tsx`** | [`my-app/src/components/SearchBar.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SearchBar.tsx) | Barra de búsqueda de direcciones y lugares mediante Nominatim OpenStreetMap. |
| **`CustomZoomControl.tsx`** | [`my-app/src/components/CustomZoomControl.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/CustomZoomControl.tsx) | Control flotante personalizado de aceleración de zoom (+ / -). |
| **`HeatmapLayer.tsx`** | [`my-app/src/components/HeatmapLayer.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/HeatmapLayer.tsx) | Capa de mapa de calor basada en la densidad de reportes. |
| **`ReportMarker.tsx`** | [`my-app/src/components/ReportMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportMarker.tsx) | Componente marcador para renderizar cada reporte individual en Leaflet. |
| **`NewsMarker.tsx`** | [`my-app/src/components/NewsMarker.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/NewsMarker.tsx) | Componente marcador para renderizar noticias históricas en Leaflet. |

---

## 28. GUÍA PRÁCTICA PARA DESARROLLADORES Y MODIFICACIONES

### Quiero agregar un nuevo filtro (ej. por severidad)
1. En [`MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx), crear un nuevo estado: `const [selectedSeverity, setSelectedSeverity] = useState<string>('todas');`.
2. Incluir `selectedSeverity` dentro del bloque `useMemo` de `filteredReports` para aplicar el criterio de comparación.
3. Pasar `selectedSeverity` y `setSelectedSeverity` como props a `<FilterPanel />`.
4. En [`FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx), agregar la interfaz del control en una nueva sección o acordeón.

### Quiero cambiar las opciones de etiquetas (Tags)
1. Modificar el arreglo `AVAILABLE_TAGS` en [`FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx).

### Quiero cambiar el diseño estético del panel de filtros
1. Editar los estilos CSS de Tailwind en [`FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx).

### Quiero modificar la lógica de filtrado por fechas
1. Actualizar las comparaciones temporales en las memorizaciones `filteredReports` y `filteredNews` en [`MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx).

---

## 29. DIFERENCIACIÓN ENTRE UI, ESTADO, LÓGICA Y LEAFLET

```text
┌────────────────────────────────────────────────────────────────────────┐
│ UI (Interfaz de Usuario)                                               │
│ Controles visuales (FilterPanel, SidebarReports, SearchBar, Checkboxes)│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Dispara Eventos
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ ESTADO (React useState)                                                │
│ Variables en memoria (selectedTags, selectedDateRange, selectedStatus) │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Alimenta
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LÓGICA DE FILTRADO (JavaScript / useMemo .filter)                     │
│ Evalúa condiciones lógicas y produce arreglos filtrados                │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Renderiza
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LEAFLET (Visualización Espacial)                                       │
│ Dibuja marcadores (ReportMarker, NewsMarker) o mapa de calor           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 30. ESTADO ACTUAL DE IMPLEMENTACIÓN

### Implementado actualmente
* Panel flotante de filtros con acordeones desplegables (`FilterPanel.tsx`).
* Panel lateral interactivo con lista de reportes y tarjetas de afectación (`SidebarReports.tsx`).
* Filtros por fuente de datos (Reportes ciudadanos y Noticias históricas).
* Filtro por estado del reporte (`pendiente`, `validado`, `rechazado`).
* Filtro por rango temporal (`todo`, `hoy`, `7dias`, `30dias`).
* Filtro por etiquetas de afectación urbana (`impactTags`).
* Alternancia de mapa base (`light`, `voyager`, `satellite`).
* Capa de Mapa de Calor (`HeatmapLayer.tsx`).
* Buscador geográfico por direcciones (`SearchBar.tsx`).
* Adaptación responsiva (Mobile/Desktop).

### Parcialmente implementado
* Integración con la tabla `reportes` de Supabase (funcional con fallback a datos *mock* si no hay registros o ante fallos de conexión).

### No encontrado / Futuras mejoras
* Botón de reinicio global de filtros (*Reset Filters*).
* Filtros por polígonos o barreras geográficas (barrios/distritos).

---

## 31. POSIBLES MEJORAS FUTURAS

1. **Botón de Restablecimiento Rápido:** Incorporar una opción de *"Limpiar filtros"* para volver al estado por defecto con un solo clic.
2. **Contador Dinámico de Resultados por Filtro:** Mostrar junto a cada checkbox el número de registros que cumplen esa condición (ej. `Pendientes (4)`).
3. **Filtro por Barrio o Zona Hidrológica:** Integrar selecciones espaciales basadas en las cuencas de los arroyos de Asunción (ej. Arroyo Mburicaó, Arroyo Jaén).
4. **Persistencia en URL (Query Params):** Guardar el estado de los filtros en la URL de la página para permitir compartir vistas específicas del mapa mediante enlaces.

---

## 32. AYUDA MEMORIA

* **Filtro:** Subconjunto seleccionado de datos.
* **Sidebar:** Panel lateral que despliega la lista de reportes ([`SidebarReports.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/SidebarReports.tsx)).
* **FilterPanel:** Panel de controles interactivos ([`FilterPanel.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/FilterPanel.tsx)).
* **`useState`:** Hook de React que almacena la selección del usuario.
* **`useMemo`:** Hook de React que optimiza el cálculo del filtrado.
* **`onChange`:** Evento que detecta cambios en checkboxes y radio buttons.
* **`.filter()`:** Método de JavaScript que extrae los elementos que cumplen los criterios.
* **Props:** Mecanismo de comunicación desde `MapView.tsx` hacia los componentes hijos.
* **Leaflet:** Renderizador gráfico que dibuja el resultado final en el mapa.

---

## 33. PREGUNTAS PARA DEFENSA DE TESIS

### 1. ¿Para qué sirven los filtros en la plataforma?
**Respuesta:** Sirven para gestionar la densidad de información en el mapa, reduciendo la saturación visual y permitiendo a los usuarios aislare incidentes por fuente, fecha, estado de validación o tipo de afectación.

### 2. ¿Qué componente actúa como orquestador central del filtrado?
**Respuesta:** El componente [`MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx), el cual almacena el estado global con `useState`, calcula las listas filtradas mediante `useMemo` y las distribuye hacia el mapa, el sidebar y el panel de filtros.

### 3. ¿Cómo se comunican el panel de filtros y el mapa?
**Respuesta:** Se comunican mediante el flujo de datos unidireccional de React. `FilterPanel` recibe las variables de estado y funciones actualizadoras (props) desde `MapView`. Al interactuar con la UI, se modifican los estados del padre, lo que desencadena un re-calculo de las listas y actualiza automáticamente los marcadores de Leaflet.

### 4. ¿Cómo evita la aplicación re-cálculos innecesarios al filtrar?
**Respuesta:** Utiliza el Hook `useMemo` en `MapView.tsx`, asegurando que la función `.filter()` de JavaScript solo se ejecute cuando realmente cambien los datos o los criterios de filtrado seleccionados.

### 5. ¿Qué ocurre si un filtro no arroja resultados?
**Respuesta:** Los marcadores se desmontan del mapa y el panel lateral (`SidebarReports.tsx`) muestra una interfaz de estado vacío con un aviso explícito de *"No se encontraron reportes con los filtros seleccionados"*.

---

## 34. RESUMEN FINAL

$$\text{DATOS (Supabase)} \longrightarrow \text{ESTADO REACT (useState)} \longrightarrow \text{LÓGICA DE FILTRADO (useMemo .filter)} \longrightarrow \text{DATOS FILTRADOS} \longrightarrow \text{REACT-LEAFLET} \longrightarrow \text{MAPA INTERACTIVO}$$

En pocas líneas, el usuario interactúa con los controles del panel de visualización o del panel lateral. Cada cambio actualiza el estado de React en el componente padre `MapView.tsx`. La aplicación filtra eficientemente los arreglos de datos en memoria y actualiza la renderización de Leaflet y del panel lateral en tiempo real, garantizando una experiencia fluida y precisa para el análisis de inundaciones urbanas.
