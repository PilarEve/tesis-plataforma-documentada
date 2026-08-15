# Capítulo 09 · Reportes ciudadanos y carga de imágenes

## 1. Objetivo de los reportes ciudadanos

Los reportes ciudadanos constituyen el mecanismo de **ciencia ciudadana y participación colectiva** dentro de la plataforma de monitoreo de inundaciones en el Área Metropolitana de Asunción. Su propósito principal es permitir a los vecinos enviar alertas hiperlocales en tiempo real sobre acumulación de agua, desbordes de arroyos y daños en infraestructura.

### Importancia dentro del sistema:
* **Información geolocalizada**: Asigna una ubicación espacial precisa (coordenadas GPS `latitud` y `longitud` de tipo `float8`) a cada evento.
* **Evidencia fotográfica**: Permite adjuntar imágenes reales tomadas con dispositivos móviles o cámaras, que se suben a **Supabase Storage** y se vinculan a la base de datos mediante una URL pública (`imagen_url`).
* **Etiquetado de afectaciones (`afectaciones`)**: Permite catalogar el impacto (ej. *"Calle inundada"*, *"Vehículo afectado"*, *"Vivienda afectada"*).
* **Visualización posterior**: Prepara la información estructurada para proyectarse como marcadores informativos o mapas de calor analíticos sobre la interfaz cartográfica Leaflet.

> [!NOTE]
> **Estado actual de los datos**: La tabla `reportes` en Supabase y la infraestructura de envío están **100% integradas y operativas en el código fuente**, aunque al momento de redactar esta documentación la tabla no posee registros almacenados en producción (0 registros).

---

## 2. Flujo conceptual del reporte ciudadano

El flujo real de procesamiento de una incidencia ciudadana desde que el usuario interactúa con la interfaz web hasta su persistencia en el servidor se sintetiza en la siguiente secuencia:

```text
┌─────────────────────────────────────────────────────────────┐
│                          USUARIO                            │
│           (Abre el formulario web ReportForm.tsx)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPTURA DE DATOS                         │
│ • Descripción textual (textarea / ref)                      │
│ • Selección de afectaciones (AVAILABLE_TAGS -> _text)        │
│ • Geolocalización GPS / Selección en mapa ([lat, lng])      │
│ • Selección de archivo de imagen (Input File)               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                VALIDACIONES CLIENTE (JS)                    │
│ • Presencia de coordenadas (lat, lng no nulas)              │
│ • Formato de imagen (image/jpeg, image/png, image/webp)     │
│ • Tamaño máximo de archivo (<= 5 MB)                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 SUPABASE STORAGE (BUCKET)                   │
│ • Subida de binario: .from('reportes').upload(...)          │
│ • Obtención URL: .from('reportes').getPublicUrl(...)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               SUPABASE DATABASE (POSTGRESQL)                │
│ • Inserción de fila: .from('reportes').insert(...)          │
│ • Asignación de estado: "pendiente"                         │
│ • Asignación de archivo_tipo: "imagen"                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    PLATAFORMA / MAPA                        │
│ • Notificación de éxito (Alert / Feedback)                   │
│ • Callback onSubmit(mappedReport) -> Actualiza estado React │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. ¿Dónde está implementado el formulario?

La funcionalidad de envío de reportes no es una página estática aislada, sino un **componente modal flotante de React** integrado dinámicamente sobre el mapa interactivo.

| Componente / Archivo | Ruta física real | Responsabilidad principal |
| :--- | :--- | :--- |
| **`ReportForm`** | [`src/components/ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx) | Componente principal que contiene el formulario modal, validaciones, carga a Storage e inserción en la base de datos de Supabase. |
| **`MapView`** | [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx) | Componente padre del mapa que gestiona el botón "Reportar Inundación", abre el modal `ReportForm` y recibe el callback `onSubmit`. |
| **`Supabase Client`** | [`src/lib/supabase.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/lib/supabase.ts) | Cliente inicializado de Supabase SDK expuesto para realizar las operaciones `.storage` y `.from('reportes')`. |
| **`Report Type`** | [`src/types/report.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/types/report.ts) | Interfaz TypeScript que define la estructura del objeto `Report` utilizado en el cliente. |

---

## 4. Campos del formulario

El formulario ([`ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx)) presenta al usuario los siguientes campos de captura:

| Campo en Interfaz | Tipo de Control HTML | Estado / Ref en React | Requerido | Campo en Tabla Supabase |
| :--- | :--- | :--- | :--- | :--- |
| **Ubicación** | Botón GPS / Mini-mapa Leaflet | `lat` (`string`), `lng` (`string`) | **Sí** | `latitud` (`float8`), `longitud` (`float8`) |
| **Afectaciones** | Botones multiselección (Pills) | `impactTags` (`string[]`) | No (Opcional) | `afectaciones` (`_text` / array de text) |
| **Descripción** | Área de texto (`<textarea>`) | `descriptionRef` (`useRef`) | No (Opcional) | `descripcion` (`text`) |
| **Evidencia fotográfica** | Input File de imagen | `imageFile` (`File \| null`) | No (Opcional) | `imagen_url` (`text`), `archivo_tipo` (`text`) |

---

## 5. Descripción (`descripcion`)

La descripción permite al usuario brindar detalles de contexto sobre el anegamiento (ej. *"El agua cubre la vereda y dificulta el paso de vehículos"*).

* **Captura en React**: Se gestiona mediante una referencia no controlada de React (`descriptionRef = useRef<HTMLTextAreaElement>(null)`) en [`ReportForm.tsx:73`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L73).
* **Validación**: Es un campo opcional. Si el usuario no escribe nada, se envía `null` a Supabase (`descriptionRef.current?.value || null`).
* **Destino en DB**: Columna `descripcion` de tipo `text` en la tabla `reportes`.

---

## 6. Afectaciones (`afectaciones`)

El campo **`afectaciones`** en Supabase es de tipo nativo PostgreSQL **`_text`** (matriz o array de cadenas de texto).

### Opciones reales disponibles en el código ([`ReportForm.tsx:9-20`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L9-L20)):
```typescript
const AVAILABLE_TAGS = [
  'Calle inundada',
  'Deslizamiento',
  'Árbol caído',
  'Vivienda afectada',
  'Vehículo afectado',
  'Persona atrapada',
  'Fallecimiento reportado',
  'Interrupción de tránsito',
  'Servicio público afectado',
  'Sin daños visibles'
];
```

* **Funcionamiento**: El usuario puede hacer clic en múltiples etiquetas. El estado React `impactTags` (array de `string`) añade o remueve elementos.
* **Envío a Supabase**: Se envía directamente el arreglo JS en el objeto de inserción `{ afectaciones: impactTags }`.
* **Alerta especial**: Si el usuario selecciona `"Persona atrapada"` o `"Fallecimiento reportado"`, la interfaz despliega automáticamente un aviso de advertencia resaltado en rojo instando a contactar inmediatamente a los servicios de emergencia.

---

## 7. Ubicación del reporte

El sistema provee dos mecanismos complementarios para capturar la posición espacial de la incidencia:

```text
                 MECANISMOS DE UBICACIÓN
                            │
         ┌──────────────────┴──────────────────┐
         ▼                                     ▼
Geolocalización Automática GPS          Selección Manual en Mapa
 (navigator.geolocation)                 (Clic en Mini-Mapa Leaflet)
```

Ambos mecanismos actualizan los estados React `lat` y `lng`.

---

## 8. Latitud y longitud (`latitud`, `longitud`)

Las coordenadas geográficas ingresadas por el usuario se convierten de texto a números decimales de doble precisión antes de enviarse a PostgreSQL:

* **En React**: Se almacenan temporalmente como cadenas en los estados `const [lat, setLat] = useState<string>('')` y `const [lng, setLng] = useState<string>('')`.
* **Transformación y envío**:
  ```typescript
  latitud: parseFloat(lat),
  longitud: parseFloat(lng)
  ```
* **Destino en DB**: Columnas `latitud` (`float8`) y `longitud` (`float8`) en la tabla `reportes`.
* **Uso en Leaflet**: Permiten instanciar marcadores `[parseFloat(lat), parseFloat(lng)]` sobre el lienzo cartográfico.

---

## 9. Geolocalización del navegador (`navigator.geolocation`)

El botón *"Usar mi ubicación actual"* invoca la API nativa HTML5 de geolocalización ([`ReportForm.tsx:90-110`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L90-L110)):

* **Obtención de coordenadas**:
  ```typescript
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLat(position.coords.latitude.toString());
      setLng(position.coords.longitude.toString());
      setIsLocating(false);
      setIsMapOpen(true); // Abre el mini-mapa para confirmación visual
    },
    (error) => {
      alert("No se pudo obtener la ubicación. Por favor, ingrese las coordenadas manualmente.");
      setIsLocating(false);
    }
  );
  ```
* **Permisos**: Requiere aprobación explícita por parte del usuario en la ventana emergente del navegador.

---

## 10. Ubicación manual en el mapa

Si el usuario rechaza la geolocalización o desea reportar un incidente ocurrido en otro punto de la ciudad:

1. Hace clic en el botón *"Ubicar manualmente"*, desplegando un mini-mapa Leaflet interactivo dentro del formulario ([`ReportForm.tsx:315-336`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L315-L336)).
2. El componente auxiliar `LocationSelector` escucha los clics en el canvas mediante el hook `useMapEvents`:
   ```typescript
   function LocationSelector({ setLocation }) {
     useMapEvents({
       click(e) {
         setLocation(e.latlng.lat.toString(), e.latlng.lng.toString());
       },
     });
     return null;
   }
   ```
3. Al tocar cualquier punto del mapa, se actualizan `lat` y `lng`, y el componente `MapUpdater` vuela suavemente la cámara (`map.flyTo`) hacia la posición seleccionada, dibujando el marcador temporal.

---

## 11. Selección y validación de imágenes

El usuario puede adjuntar una imagen utilizando el control `<input type="file" accept="image/jpeg,image/png,image/webp">` ([`ReportForm.tsx:420-426`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L420-L426)).

### Validaciones comprobadas en código ([`ReportForm.tsx:112-134`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L112-L134)):
1. **Formatos permitidos**: Exclusivamente imágenes con MIME type `image/jpeg`, `image/png` o `image/webp`.
2. **Tamaño máximo**: Límite estricto de **5 MB** (`5 * 1024 * 1024` bytes).
3. **Vista previa visual**: Al seleccionar un archivo válido, el código genera una URL temporal del blob local (`URL.createObjectURL(file)`) que despliega la fotografía dentro del formulario, mostrando además su nombre, peso formateado y tipo MIME.

---

## 12. Clasificación del archivo (`archivo_tipo`)

La tabla `reportes` posee la columna **`archivo_tipo`** de tipo `text`.

* **Uso comprobado en el código**: En [`ReportForm.tsx:185`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L185), cuando la persona adjunta una imagen válida, la variable local `archivoTipo` se establece con el valor fijo `'imagen'`.
* **Destino en DB**: Se inserta como `"imagen"` si existe archivo o `null` si el reporte no incluye fotografía.

---

## 13. Configuración de Supabase Storage (Bucket `REPORTES`)

El archivo de imagen no se guarda en PostgreSQL. Se almacena en el bucket público de **Supabase Storage** denominado **`REPORTES`**.

### Políticas de seguridad verificadas directamente en Supabase:
* **Política de Carga (`INSERT`)**: *"Permitir subir imagenes de reportes"*. Habilita la subida de archivos binarios a usuarios anónimos (`anon`) y autenticados (`authenticated`).
* **Política de Lectura (`SELECT`)**: *"Permitir ver imagenes de reportes"*. Permite el acceso público a las imágenes desde cualquier navegador.

---

## 14. Proceso técnico de carga de imagen (`.upload`)

El procedimiento de carga en Supabase Storage se ejecuta en [`ReportForm.tsx:183-199`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L183-L199):

```typescript
const fileExt = imageFile.name.split('.').pop() || '';
const fileName = `${crypto.randomUUID()}.${fileExt}`;
const filePath = `imagenes/${fileName}`;

const { error: uploadError } = await supabase.storage
  .from('reportes')
  .upload(filePath, imageFile, {
    contentType: imageFile.type,
    upsert: false
  });
```

* **Nombre único**: Se utiliza `crypto.randomUUID()` para generar un nombre de archivo único e irrepetible (ej. `imagenes/a1b2c3d4-e5f6-7890.jpg`), evitando colisiones de nombres entre usuarios.

---

## 15. Generación de la URL pública (`.getPublicUrl`) y `imagen_url`

Inmediatamente después de una subida exitosa, el código solicita la URL HTTP pública del archivo ([`ReportForm.tsx:201-205`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L201-L205)):

```typescript
const { data: { publicUrl } } = supabase.storage
  .from('reportes')
  .getPublicUrl(filePath);

finalImageUrl = publicUrl;
```

```text
 ┌──────────────────────┐
 │   ARCHIVO BINARIO    │ (JPG / PNG)
 └──────────┬───────────┘
            │
            ▼ (Subida via .upload)
 ┌──────────────────────┐
 │   SUPABASE STORAGE   │ (Bucket 'REPORTES' ->imagenes/uuid.jpg)
 └──────────┬───────────┘
            │
            ▼ (Obtención via .getPublicUrl)
 ┌──────────────────────┐
 │   URL PÚBLICA HTTP   │ (https://.../storage/v1/object/public/reportes/imagenes/uuid.jpg)
 └──────────┬───────────┘
            │
            ▼ (Persistencia en PostgreSQL)
 ┌──────────────────────┐
 │   TABLA 'REPORTES'   │ (Columna imagen_url)
 └──────────────────────┘
```

---

## 16. Justificación de la arquitectura de imágenes (`imagen_url`)

Las bases de datos relacionales no están optimizadas para almacenar grandes archivos binarios directamente en sus filas (bloques BLOB). 

* **Solución aplicada**: Supabase Storage actúa como servidor de archivos optimizado. La tabla `reportes` almacena únicamente una referencia textual corta en la columna `imagen_url` (`text`). De este modo, las consultas SQL a la base de datos se ejecutan en milisegundos sin sobrecargar el servidor.

---

## 17. Procesamiento del envío (`handleSubmit`)

Al presionar *"Confirmar y Enviar Reporte"*, la función asíncrona `handleSubmit` ([`ReportForm.tsx:169-255`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L169-L255)) ejecuta la siguiente secuencia de pasos:

1. `e.preventDefault()` evita el recargo por defecto del navegador.
2. Comprueba la bandera `isSubmitting` para prevenir envíos duplicados por clics repetidos.
3. Valida que `lat` y `lng` no estén vacíos. Si están vacíos, detiene la ejecución y muestra una alerta (`alert`).
4. Si existe `imageFile`, ejecuta la subida a Storage y obtiene la URL pública.
5. Invoca `supabase.from("reportes").insert(...)`.
6. Si la inserción es exitosa, despliega un mensaje de éxito (`alert("¡Reporte enviado con éxito!")`).
7. Construye el objeto `mappedNewReport` y ejecuta `onSubmit(mappedNewReport)` para actualizar la vista en tiempo real sin recargar la página.
8. Limpia todos los campos del formulario y cierra el estado de carga (`setIsSubmitting(false)`).

---

## 18. Inserción en la tabla `reportes` (`.insert`)

La inserción física en PostgreSQL se realiza en [`ReportForm.tsx:208-220`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L208-L220):

```typescript
const { data, error: insertError } = await supabase
  .from("reportes")
  .insert({
    descripcion: descriptionRef.current?.value || null,
    latitud: parseFloat(lat),
    longitud: parseFloat(lng),
    imagen_url: finalImageUrl ?? null,
    archivo_tipo: archivoTipo ?? null,
    estado: "pendiente",
    afectaciones: impactTags,
  })
  .select()
  .single();
```

---

## 19. Estado del reporte (`estado`)

En la llamada `.insert()`, la aplicación asigna explícitamente la cadena **`"pendiente"`** a la columna `estado`.

* **Comportamiento**: Esto garantiza que todo reporte ciudadano ingresado desde la interfaz pública ingrese en un estado de espera para ser posteriormente auditado o validado por las autoridades o administradores.
* **Nota metodológica**: El valor `"pendiente"` es establecido por el frontend durante la inserción.

---

## 20. Fecha de creación (`creado_en`)

* **En la inserción**: El frontend **no** incluye la columna `creado_en` dentro del objeto `.insert({...})`.
* **Generación**: La marca de tiempo con zona horaria (`timestamptz`) es generada automáticamente por el servidor de PostgreSQL en Supabase al momento de procesar la transacción.
* **Respuesta**: Al solicitar `.select().single()`, Supabase retorna el objeto con la fecha asignada en servidor, la cual se mapea a la propiedad `dateTime` en el cliente (`data.creado_en`).

---

## 21. Validaciones de interfaz implementadas

| Validación | Regla / Condición | Resultado si falla |
| :--- | :--- | :--- |
| **Ubicación requerida** | `!lat \|\| !lng` | Detiene el envío y despliega un cuadro de alerta: *"Seleccioná una ubicación en el mapa antes de enviar el reporte"*. |
| **Formato de imagen** | MIME no incluido en JPEG/PNG/WebP | Rechaza la selección del archivo y alerta: *"Tipo de archivo no permitido"*. |
| **Tamaño de imagen** | Peso superior a 5 MB (`> 5242880 bytes`) | Rechaza el archivo y alerta: *"La imagen supera el tamaño máximo permitido (5 MB)"*. |
| **Prevención de doble envío** | `isSubmitting === true` | Bloquea el botón de envío y muestra un indicador de carga giratorio (Spinner). |

---

## 22. Mensajes e indicadores de retroalimentación (Feedback)

1. **Estado de Carga de Ubicación**: Muestra *"Obteniendo ubicación..."* en el botón mientras consulta el GPS.
2. **Confirmación de Ubicación**: Despliega un indicador verde animado *"Ubicación seleccionada"* cuando `lat` y `lng` poseen valores.
3. **Indicador de Subida / Envío**: Desactiva el botón principal y cambia el texto a *"Enviando reporte..."* acompañado del ícono `<Loader2 className="animate-spin" />`.
4. **Mensaje de Éxito**: Despliega una alerta del navegador (`alert("¡Reporte enviado con éxito!")`) al completar la transacción.
5. **Aviso de Emergencia**: Cuadro rojo prominente si el usuario selecciona personas atrapadas o fallecimientos.

---

## 23. Manejo de errores

El envío del formulario se encuentra totalmente protegido dentro de un bloque **`try / catch`** ([`ReportForm.tsx:182-253`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L182-L253)):

* **Error en Storage**: Si la subida del archivo falla (ej. falla de red), se dispara una excepción `throw new Error(...)` que aborta la inserción en la base de datos para no dejar registros corruptos sin imagen.
* **Error en DB**: Si la base de datos rechaza la inserción SQL, se captura el mensaje de error de Supabase y se despliega al usuario mediante un `alert(msg)`.
* **Restauración de estado**: El bloque `finally` garantiza que `setIsSubmitting(false)` se ejecute siempre, devolviendo la interactividad al botón.

---

## 24. Inventario de estados React (`useState`) en `ReportForm.tsx`

| Estado | Tipo | Propósito |
| :--- | :--- | :--- |
| `lat` | `string` | Almacena la cadena de latitud seleccionada. |
| `lng` | `string` | Almacena la cadena de longitud seleccionada. |
| `impactTags` | `string[]` | Guarda la lista de afectaciones seleccionadas por el usuario. |
| `imageFile` | `File \| null` | Almacena el objeto binario de la imagen lista para subir. |
| `filePreviewUrl` | `string` | Guarda la URL del blob local para mostrar la vista previa de la foto. |
| `isLocating` | `boolean` | Indica si el navegador está consultando el GPS. |
| `isSubmitting` | `boolean` | Controla la deshabilitación del formulario durante el envío a Supabase. |
| `isAfectacionesOpen` | `boolean` | Controla el despliegue del acordeón de opciones de afectaciones. |
| `isMapOpen` | `boolean` | Controla el despliegue del mini-mapa selector de ubicación. |

---

## 25. Flujo completo real de un reporte

```text
1. El usuario hace clic en "Reportar Inundación" en la interfaz del Mapa
                 │
                 ▼
2. Se renderiza el modal flotante ReportForm.tsx
                 │
                 ▼
3. El usuario pulsa "Usar mi ubicación actual" (GPS) o marca un punto en el mini-mapa
                 │
                 ▼
4. Se asignan las coordenadas lat y lng en el estado de React
                 │
                 ▼
5. El usuario selecciona etiquetas de afectación (ej. "Calle inundada") y escribe un comentario
                 │
                 ▼
6. El usuario adjunta una foto (JPG <= 5MB). Se genera vista previa local
                 │
                 ▼
7. El usuario pulsa "Confirmar y Enviar Reporte"
                 │
                 ▼
8. handleSubmit valida coordenadas y formatos
                 │
                 ▼
9. supabase.storage.from('reportes').upload(...) guarda la foto en el bucket REPORTES
                 │
                 ▼
10. supabase.storage.from('reportes').getPublicUrl(...) obtiene el enlace de la foto
                 │
                 ▼
11. supabase.from('reportes').insert(...) registra la fila en PostgreSQL con estado "pendiente"
                 │
                 ▼
12. Se notifica al usuario con alert("¡Reporte enviado con éxito!") y se actualiza la lista local
```

---

## 26. Relación entre los datos del formulario y la Base de Datos

| Dato capturado en el formulario | Columna en Supabase (`reportes`) | Tipo PostgreSQL |
| :--- | :--- | :--- |
| Referencia de texto en `descriptionRef` | `descripcion` | `text` |
| Coordenada decimal `parseFloat(lat)` | `latitud` | `float8` |
| Coordenada decimal `parseFloat(lng)` | `longitud` | `float8` |
| URL obtenida de `getPublicUrl` | `imagen_url` | `text` |
| Valor fijo `'imagen'` (si hay foto) | `archivo_tipo` | `text` |
| Cadena fija `"pendiente"` | `estado` | `text` |
| Arreglo de opciones `impactTags` | `afectaciones` | `_text` (array de text) |
| Generado en servidor PostgreSQL | `creado_en` | `timestamptz` |
| Clave Primaria UUID en servidor | `id` | `uuid` |

---

## 27. Relación con la visualización en el mapa

Una vez que un reporte es insertado en la tabla `reportes`, el flujo para su posterior visualización cartográfica se encuentra totalmente preparado en [`MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx):

```text
Tabla 'reportes' en Supabase
            │
            ▼  (Consulta SELECT al cargar el mapa)
MapView.tsx (useEffect)
            │
            ▼  (Transformación a objeto Report)
Array 'reports' en estado de React
            │
            ▼  (Mapeo de componentes)
<ReportMarker position={[report.lat, report.lng]} />
            │
            ▼
Ícono circular azul dibujado en Leaflet con Popup informativo
```

---

## 28. Estado actual de la implementación

### Implementado y Operativo:
* Componente de formulario modal completo ([`ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx)).
* Integración con la API de geolocalización HTML5.
* Mini-mapa selector de ubicación interactivo basado en React Leaflet.
* Carga de archivos de imagen a Supabase Storage (Bucket `REPORTES`).
* Inserción directa de registros en la tabla `reportes` de Supabase.
* Mapeo de afectaciones múltiples (`_text`).

### Preparado pero sin datos actuales:
* La tabla `reportes` posee el esquema completo en Supabase y la aplicación posee las funciones de lectura y escritura, pero al momento de la documentación **posee 0 registros**.

---

## 29. Seguridad y consideraciones administrativas

* **Permisos de Storage**: Las políticas del bucket `REPORTES` permiten la subida anónima para facilitar la participación ciudadana sin obligar al usuario a iniciar sesión.
* **Moderación**: Todos los reportes se crean con `estado: "pendiente"`, permitiendo que en el futuro un panel administrativo valide o rechace las publicaciones antes de mostrarlas como verificadas.

---

## 30. Funcionalidades de análisis de imágenes (Estado actual vs. Futuro)

* **Estado actual**: La plataforma no ejecuta validación por Inteligencia Artificial sobre las imágenes subidas. Se limita a validar la extensión del archivo y su peso (máximo 5 MB).
* **Mejoras futuras posibles**: Integración de servicios de visión por computadora (ej. OpenCV o TensorFlow) para verificar automáticamente si la fotografía contiene agua o inundación real antes de guardarla.

---

## 31. Inventario de archivos involucrados

| Archivo | Ruta física | Función en el sistema |
| :--- | :--- | :--- |
| **Formulario Modal** | [`src/components/ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx) | Interfaz del formulario, geolocalización, subida a Storage e inserción DB. |
| **Vista de Mapa** | [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx) | Despliega el botón de reporte, gestiona la apertura del modal y lee los reportes de DB. |
| **Cliente Supabase** | [`src/lib/supabase.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/lib/supabase.ts) | Conexión e instancia SDK para la base de datos y Storage. |
| **Tipos TypeScript** | [`src/types/report.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/types/report.ts) | Definiciones de tipos del objeto `Report`. |

---

## 32. Guía para modificar la funcionalidad de reportes

* **Si quiero agregar un nuevo campo al formulario**: Modifica la interfaz en [`ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx), añade el estado React y actualiza el objeto dentro de `.insert({...})`.
* **Si quiero cambiar las opciones de afectaciones**: Edita el arreglo `AVAILABLE_TAGS` en [`src/components/ReportForm.tsx:9-20`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L9-L20).
* **Si quiero modificar las reglas de validación de imágenes**: Edita la función `validateFile` en [`src/components/ReportForm.tsx:112-134`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L112-L134).
* **Si quiero cambiar el bucket de destino de las fotos**: Modifica las llamadas `supabase.storage.from('reportes')` en [`ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx#L191).

---

## 33. Ayuda memoria

```text
================================================================================
                               AYUDA MEMORIA
================================================================================
• ReportForm.tsx     -> Archivo principal del formulario modal de reportes.
• Reporte ciudadano  -> Información sobre inundación generada por el usuario.
• Afectaciones       -> Array de cadenas de texto (tipo PostgreSQL _text).
• latitud/longitud   -> Coordenadas geográficas decimales (float8).
• REPORTES           -> Bucket público de Supabase Storage para alojar imágenes.
• imagen_url         -> Referencia HTTP pública a la foto guardada en Storage.
• estado             -> Estado de verificación (frontend asigna "pendiente").
• .insert(...)       -> Función de Supabase SDK para guardar la fila en PostgreSQL.
• .upload(...)       -> Subida del binario de imagen al bucket Storage.
• .getPublicUrl(...) -> Generación del enlace HTTP público de la imagen.
================================================================================
```

---

## 34. Preguntas que debería poder responder

### ¿Qué es un reporte ciudadano y por qué se utiliza?
Es una notificación geolocalizada enviada por los vecinos sobre eventos de inundación. Se utiliza como mecanismo de ciencia ciudadana para recopilar datos en tiempo real en zonas donde no existen sensores automáticos.

### ¿Dónde está implementado el formulario y cómo se despliega?
Está implementado en el componente [`src/components/ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx) y se despliega como una ventana modal flotante sobre la vista principal del mapa ([`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx)).

### ¿Cómo se obtiene la ubicación del reporte?
Mediante dos métodos integrados: 1) Geolocalización automática GPS usando la API `navigator.geolocation` del navegador; 2) Selección manual sobre un mini-mapa interactivo Leaflet donde el usuario toca las coordenadas deseadas.

### ¿Dónde y cómo se guardan las fotografías?
Los archivos físicos de imagen se suben al bucket público `REPORTES` en **Supabase Storage** mediante `supabase.storage.from('reportes').upload()`. Luego se obtiene la URL pública con `.getPublicUrl()` y esta cadena se almacena en la columna `imagen_url` de PostgreSQL.

### ¿Por qué la imagen no se almacena directamente en la tabla relacional?
Para optimizar el rendimiento de la base de datos. Guardar archivos binarios en una tabla relacional ralentiza las consultas SQL; guardar una URL pública mantiene la base de datos liviana y rápida.

### ¿Qué tipo de dato es `afectaciones` en la base de datos?
Es un tipo de dato nativo de PostgreSQL `_text` (matriz de texto), lo que permite guardar múltiples etiquetas seleccionadas (ej. *"Calle inundada"*, *"Vehículo afectado"*) en una sola columna sin necesidad de una tabla intermedia.

### ¿Cómo llega un reporte a Supabase y cómo podría aparecer luego en el mapa?
Al presionar enviar, el frontend sube la foto a Storage, obtiene la URL y ejecuta `supabase.from('reportes').insert({...})`. Al cargar el mapa, `MapView.tsx` realiza una consulta `SELECT * FROM reportes` y renderiza cada registro como un marcador circular azul (`ReportMarker.tsx`).

### ¿Qué estado asigna la aplicación al crear un reporte?
La aplicación asigna explícitamente el estado `"pendiente"` a la columna `estado` para permitir un flujo futuro de moderación antes de marcar el reporte como verificado.

---

# Checklist de integración

- [x] **Formulario Modal UI**: Implementado y estilizado en `ReportForm.tsx`.
- [x] **Geolocalización GPS**: Funcionando vía `navigator.geolocation`.
- [x] **Selector de mapa**: Mini-mapa interactivo Leaflet integrado.
- [x] **Validación de archivos**: Límite de 5 MB y formatos JPG/PNG/WebP.
- [x] **Carga a Supabase Storage**: Integrado con el bucket `REPORTES`.
- [x] **Inserción SQL en Supabase**: Operación `.insert()` configurada a la tabla `reportes`.
- [x] **Visualización en Mapa**: Preparada en `MapView.tsx` para dibujar marcadores azules al existir registros.

