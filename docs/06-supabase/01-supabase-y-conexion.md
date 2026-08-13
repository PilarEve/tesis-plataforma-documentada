# Capítulo 06: Supabase y Conexión con la Aplicación

Este documento explica detalladamente el rol que cumple **Supabase** como plataforma de servicios backend (*Backend-as-a-Service*) dentro del proyecto de tesis. Se describe cómo la aplicación desarrollada en **Next.js** se conecta a la base de datos relacional y al almacenamiento remoto de objetos, identificando los archivos de configuración, las librerías utilizadas y las consultas reales implementadas en el código fuente.

---

## 1. Objetivo del capítulo

El objetivo de este capítulo es brindar una respuesta técnica y didáctica a las siguientes preguntas clave:

- **¿Qué es Supabase?**
- **¿Por qué se utiliza en este proyecto de tesis?**
- **¿Qué servicios de Supabase utiliza actualmente la aplicación?**
- **¿Cómo se conecta Next.js con Supabase?**
- **¿En qué archivos está configurada dicha conexión?**
- **¿Cómo fluyen los datos desde la nube hasta la interfaz del mapa interactivo y los formularios?**

---

## 2. ¿Qué es Supabase?

**Supabase** es una plataforma de desarrollo backend de código abierto (*Open Source*) que proporciona un conjunto de herramientas y servicios integrados en la nube para simplificar la gestión de datos de una aplicación web.

### Servicios principales que provee Supabase

1. **PostgreSQL (Base de datos relacional)**: Motor de base de datos SQL potente, robusto y estándar en la industria.
2. **API REST y Realtime autogenerada**: Proporciona interfaces automáticas para consultar e insertar datos mediante JavaScript sin necesidad de escribir un servidor backend tradicional desde cero.
3. **Storage (Almacenamiento de archivos)**: Sistema de almacenamiento remoto para guardar archivos multimedia (fotografías, imágenes, documentos) organizados en contenedores llamados *buckets*.
4. **Row Level Security (RLS)**: Mecanismo de seguridad nativo de PostgreSQL que permite definir reglas de acceso a nivel de fila directamente en la base de datos.

---

## 3. Frontend y Backend en el proyecto

Para comprender el funcionamiento integral del sistema, es necesario distinguir la responsabilidad de cada tecnología:

```text
┌──────────────────────────────────────┐       Peticiones HTTP        ┌──────────────────────────────────────┐
│       FRONTEND (Cliente Web)         │ <──────────────────────────> │          BACKEND (Supabase)          │
│ • Next.js + React + TypeScript       │        JSON / Images         │ • PostgreSQL Database                │
│ • Renderizado del Mapa (Leaflet)     │                              │ • Supabase Storage (Imágenes)        │
│ • Formularios y Filtros de Interfaz  │                              │ • API REST Autogenerada              │
└──────────────────────────────────────┘                              └──────────────────────────────────────┘
```

- **Frontend (Next.js / React)**: Todo lo que ocurre en el navegador del usuario (interfaz visual, paneles, formularios, interacción con el mapa cartográfico y gestión de estado local).
- **Backend (Supabase)**: El servidor remoto que almacena de forma persistente los registros de la base de datos relacional y procesa el almacenamiento físico de las imágenes adjuntas a los reportes.

---

## 4. ¿Por qué Supabase en este proyecto?

En el contexto del monitoreo de inundaciones urbanas en el Área Metropolitana de Asunción (AMA), el sistema requiere gestionar información heterogénea y geolocalizada en tiempo real. Supabase resuelve de manera limpia las siguientes necesidades operativas:

1. **Persistencia de reportes ciudadanos**: Guardar las coordenadas geográficas (`latitud`, `longitud`), descripciones, etiquetas de afectación y fechas de incidencias enviadas por la población.
2. **Almacenamiento de evidencias visuales**: Recibir y alojar fotografías reales tomadas por los usuarios durante eventos de lluvia intensa.
3. **Consulta de noticias históricas**: Almacenar y entregar los registros históricos de eventos pasados documentados en medios periodísticos para renderizarlos sobre el mapa.
4. **Respuesta rápida y liviana**: Permitir que la aplicación web obtenga registros en formato JSON e hiper-localice los marcadores dinámicamente sin sobrecargar el servidor web.

---

## 5. Dependencia de Supabase en el proyecto

Para interactuar con la plataforma de Supabase desde el código de TypeScript/React, el proyecto utiliza la librería oficial para JavaScript.

### Inspección en `package.json`

Al revisar el archivo [`package.json`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json), se comprueba la siguiente dependencia instalada:

```json
"dependencies": {
  "@supabase/supabase-js": "^2.105.3"
}
```

### ¿Para qué sirve esta librería?

`@supabase/supabase-js` es el cliente oficial que provee funciones predefinidas (como `.from()`, `.select()`, `.insert()`, `.storage`) para consultar la base de datos y gestionar archivos remotos mediante sintaxis limpia de JavaScript/TypeScript.

### Comando conceptual de instalación

En un proyecto nuevo, esta librería se añade ejecutando en la terminal:

```bash
npm install @supabase/supabase-js
```

*(Nota: En este repositorio ya se encuentra instalada; no debe ejecutarse ningún comando).*

---

## 6. Variables de entorno

Para conectar la aplicación local con el proyecto correspondiente en la nube de Supabase, se requieren dos parámetros esenciales de configuración.

### Variables de entorno utilizadas en el proyecto

1. **`NEXT_PUBLIC_SUPABASE_URL`**: Contiene la dirección URL del proyecto en los servidores de Supabase (ejemplo conceptual: `https://xxxx.supabase.co`).
2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Contiene la clave pública (*anon key*) que permite al cliente JavaScript autenticarse y realizar consultas autorizadas contra la API de Supabase.

### El prefijo `NEXT_PUBLIC_`

En Next.js, las variables de entorno que comienzan con el prefijo `NEXT_PUBLIC_` son expuestas intencionalmente al navegador web. Esto es indispensable para que el código ejecutado en el cliente (como el formulario de reportes o el mapa) pueda enviar consultas directamente a Supabase.

---

## 7. Seguridad de `.env.local`

Las variables de entorno locales se configuran dentro de un archivo de texto en la raíz del proyecto llamado:

```text
.env.local
```

### Protección en el control de versiones

Al inspeccionar el archivo [`.gitignore`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/.gitignore), se comprueba la siguiente regla de exclusión:

```text
# env files (can opt-in for committing if needed)
.env*
```

### ¿Por qué es vital esta regla?

1. **Privacidad de credenciales**: Impide que el archivo `.env.local` y sus valores privados de configuración se suban por accidente al repositorio remoto de GitHub.
2. **Independencia de entornos**: Permite que cada desarrollador o entorno de despliegue (como Vercel) configure sus propias credenciales de forma aislada e independiente.

---

## 8. Crear el cliente de Supabase

La inicialización de la conexión con Supabase reside en un único archivo centralizado dentro del código fuente.

### Archivo real del cliente

Ubicación: [`src/lib/supabase.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/lib/supabase.ts)

### Inspección del código fuente real

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- **`createClient()`**: Función de la librería `@supabase/supabase-js` que inicializa el cliente de comunicación.
- **Valores fallback (*placeholder*)**: Si las variables de entorno no están presentes durante el inicio, el código utiliza URLs temporales de reemplazo para evitar cierres abruptos (*crashes*) de la aplicación durante la etapa de compilación.
- **Objeto `supabase`**: Instancia singleton exportada que es importada por los componentes de React para ejecutar consultas.

---

## 9. ¿Qué es un cliente de Supabase?

El objeto `supabase` actúa como un intermediario o puente inteligente entre el código del frontend y los servicios remotos.

```text
[Componente React: MapView.tsx]
               │
               ▼
   [import { supabase } from '@/lib/supabase']
               │
               ▼
[Cliente Supabase: supabase.from('reportes').select()]
               │  (Transmite petición HTTP/REST)
               ▼
     [Servidores de Supabase] ───> [PostgreSQL / Storage]
```

---

## 10. Consultas a la base de datos (Lectura)

El proyecto utiliza la sintaxis encadenada de PostgREST para realizar consultas a la base de datos de manera intuitiva.

### Patrón básico de consulta

```typescript
const { data, error } = await supabase
  .from('nombre_tabla')
  .select('*')
```

### Desglose de funciones

- **`supabase`**: Es el cliente inicializado importado desde `@/lib/supabase`.
- **`.from('nombre_tabla')`**: Especifica la tabla relacional sobre la cual se ejecutará la operación SQL.
- **`.select('*')`**: Especifica qué columnas se desean recuperar (en este caso, todas las columnas).
- **`.order('columna', { ascending: false })`**: Ordena los registros de manera descendente según un campo determinado (por ejemplo, fecha de creación).

---

## 11. Lectura de datos en la aplicación real

En el componente del mapa ([`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx)), se ejecutan dos lecturas principales al cargarse la pantalla:

### 1. Carga de Reportes Ciudadanos

```typescript
const { data, error } = await supabase
  .from('reportes')
  .select('*')
  .order('creado_en', { ascending: false });
```

### 2. Carga de Noticias Históricas

```typescript
const { data: newsData, error: newsError } = await supabase
  .from('noticias_historicas')
  .select('*')
  .order('fecha_publicacion', { ascending: false });
```

### Flujo de transformación y renderizado

```text
1. Consulta asíncrona a Supabase
            │
            ▼
2. Respuesta recibida (data)
            │
            ▼
3. Mapeo a interfaces de TypeScript (`Report`)
            │
            ▼
4. Almacenamiento en estado de React (`setReports(mappedReports)`)
            │
            ▼
5. Renderizado dinámico de marcadores en el mapa Leaflet
```

---

## 12. Escritura de datos (Inserción)

La inserción de datos se utiliza para guardar los reportes ciudadanos enviados desde el formulario web.

### Operación real de inserción

En el componente [`src/components/ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx), la creación de un nuevo reporte utiliza el método `.insert()`:

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

- **`.insert({...})`**: Recibe un objeto JavaScript con los nombres de las columnas y sus respectivos valores.
- **`estado: "pendiente"`**: Todo nuevo reporte se registra inicialmente con estado pendiente para su posterior validación.
- **`.select().single()`**: Solicita a Supabase que devuelva inmediatamente el objeto completo recién creado en la base de datos (incluyendo su ID autogenerado).

---

## 13. Flujo de envío de un reporte ciudadano

El proceso completo desde que el usuario interactúa con la pantalla hasta que los datos quedan grabados en Supabase sigue este esquema:

```text
┌────────────────────────┐
│ 1. Usuario hace clic   │  Selecciona un punto geográfico en el mapa
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ 2. Formulario Modal    │  Completa descripción, etiquetas de afectación y adjunta foto
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ 3. Subida de Imagen    │  Si adjuntó foto, se sube a Supabase Storage y se obtiene la URL
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ 4. Inserción SQL       │  `supabase.from('reportes').insert(...)`
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ 5. Actualización React │  El nuevo reporte se añade a la lista activa del mapa
└────────────────────────┘
```

---

## 14. Imágenes y Supabase Storage

Además de la base de datos relacional, el proyecto utiliza el servicio de **Supabase Storage** para gestionar archivos físicos de imágenes.

### Funcionamiento en `ReportForm.tsx`

Cuando el usuario adjunta una fotografía como evidencia en un reporte:

1. **Definición del Bucket**: Se utiliza el bucket de almacenamiento llamado `'reportes'`.
2. **Generación de ruta única**: Se construye un nombre de archivo único utilizando un UUID para evitar colisiones:
   ```typescript
   const fileName = `${crypto.randomUUID()}.${fileExt}`;
   const filePath = `imagenes/${fileName}`;
   ```
3. **Subida del archivo físico**:
   ```typescript
   const { error: uploadError } = await supabase.storage
     .from('reportes')
     .upload(filePath, imageFile, {
       contentType: imageFile.type,
       upsert: false
     });
   ```
4. **Obtención de la URL pública**:
   ```typescript
   const { data: { publicUrl } } = supabase.storage
     .from('reportes')
     .getPublicUrl(filePath);
   ```
5. **Persistencia en la tabla**: La `publicUrl` obtenida se guarda en la columna `imagen_url` de la tabla `reportes`.

---

## 15. Configuración de dominios remotos de imágenes

Para que Next.js permita mostrar las imágenes alojadas en Supabase Storage mediante el componente optimizado de imágenes, se configuró el dominio en el archivo [`next.config.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/next.config.ts):

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gexfcndaymqdnuobjxnb.supabase.co',
      },
    ],
  },
};
```

---

## 16. Supabase y la visualización sobre el mapa

La integración entre los datos recuperados de Supabase y la representación cartográfica en Leaflet se resume en la siguiente secuencia:

```text
[Tabla `reportes` en Supabase]
       │
       ▼  (Petición SELECT)
[Campos: `latitud`: -25.28, `longitud`: -57.63]
       │
       ▼  (Transformación en `MapView.tsx`)
[Objeto Report { lat: -25.28, lng: -57.63 }]
       │
       ▼  (Renderizado en React-Leaflet)
[Componente <ReportMarker position={[-25.28, -57.63]} />]
       │
       ▼
[Ícono visible sobre la ciudad de Asunción en la pantalla del usuario]
```

---

## 17. Manejo de errores

Todas las llamadas a la API de Supabase devuelven un objeto compuesto por dos propiedades principales: `{ data, error }`.

### Patrón de verificación de errores

```typescript
const { data, error } = await supabase.from('reportes').select('*');

if (error) {
  console.error('Error al consultar Supabase:', {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  });
  // Manejo de contingencia (ejemplo: cargar datos locales de prueba o mostrar mensaje)
} else {
  // Procesar los datos satisfactoriamente
}
```

- **`data`**: Contiene la lista de registros o el objeto devuelto cuando la operación es exitosa. Si hay un error, vale `null`.
- **`error`**: Contiene los detalles técnicos del fallo (mensaje, código de error de PostgreSQL, sugerencia). Si la operación es exitosa, vale `null`.

---

## 18. Consultas asíncronas (`async` / `await`)

Las operaciones de comunicación con Supabase se realizan a través de la red (Internet). Por lo tanto, no se completan de forma instantánea y deben ejecutarse de manera **asíncrona** en JavaScript.

```typescript
const fetchReports = async () => {
  const response = await supabase.from('reportes').select('*');
};
```

- **`async`**: Declara que la función realizará operaciones asíncronas en segundo plano.
- **`await`**: Pausa la ejecución interna de la función hasta que el servidor de Supabase responda, evitando bloquear la interfaz gráfica del navegador mientras los datos viajan por la red.

---

## 19. Supabase dentro de componentes React

En la arquitectura del proyecto, la comunicación con Supabase se ejecuta en dos momentos clave dentro del ciclo de vida de los componentes:

1. **Al montar el componente (`useEffect`)**: Se utiliza en `MapView.tsx` para solicitar los reportes e historia de noticias apenas la página se carga en la pantalla del usuario.
2. **En respuesta a eventos de usuario**: Se utiliza en `ReportForm.tsx` al presionar el botón de enviar (*Submit*), desencadenando la subida de la imagen y la inserción del nuevo registro.

---

## 20. Flujo general de arquitectura del sistema

```text
[Usuario / Ciudadano]
        │
        ├─── Petición de lectura ──────► [MapView.tsx]
        │                                    │
        │                                    ▼
        │                         [src/lib/supabase.ts]
        │                                    │
        │                                    ▼
        │                           [API REST Supabase]
        │                                    │
        │                        ┌───────────┴───────────┐
        │                        ▼                       ▼
        │               [PostgreSQL DB]          [Supabase Storage]
        │              (Tablas: reportes,       (Bucket: reportes/
        │             noticias_historicas)          imagenes/)
        │                        │                       │
        │                        └───────────┬───────────┘
        │                                    ▼
        └─── Visualiza en pantalla <──── [Renderizado Leaflet + UI]
```

---

## 21. División de responsabilidades: Next.js vs. Supabase

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      DIVISIÓN DE RESPONSABILIDADES                     │
├───────────────────────────────────┬────────────────────────────────────┤
│           Next.js / React         │              Supabase              │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Construcción de la interfaz web.│ • Almacenamiento SQL en PostgreSQL.│
│ • Renderizado del mapa (Leaflet). │ • Hosting físico de imágenes.      │
│ • Validación de formularios.      │ • Autogestión de la API REST.      │
│ • Gestión de estados locales.     │ • Seguridad y persistencia.        │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 22. Configuración al clonar el proyecto en otra computadora

Si una persona clona este repositorio desde GitHub en una computadora nueva, el archivo `.env.local` no estará presente (debido a la regla de `.gitignore`).

### Pasos obligatorios para configurar el entorno

1. Crear un archivo llamado `.env.local` en la raíz de la carpeta `my-app/`.
2. Escribir los nombres de las variables requeridas asignando los valores correspondientes al proyecto de Supabase:

```env
# Plantilla de configuración segura (.env.local)
NEXT_PUBLIC_SUPABASE_URL=TU_URL_DE_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_CLAVE_ANONIMA_DE_SUPABASE
```

---

## 23. Ruta de prueba de conexión (`/test-db`)

El repositorio cuenta con una ruta utilitaria diseñada exclusivamente para verificar que la conexión entre Next.js y Supabase se encuentre operativa.

### Ubicación del archivo
[`app/test-db/page.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/app/test-db/page.tsx)

### Código de verificación

```typescript
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

export default async function TestDBPage() {
  const { data, error } = await supabase
    .from('reportes')
    .select('*')

  return (
    <main style={{ padding: '20px' }}>
      <h1>Prueba Supabase</h1>
      <h2>Datos:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <h2>Error:</h2>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </main>
  )
}
```

Al navegar a `http://localhost:3000/test-db` en el navegador, la página devolverá en pantalla los registros JSON crudos obtenidos directamente desde la tabla `reportes` de Supabase.

---

## 24. Errores frecuentes al conectar Supabase

### 1. `NEXT_PUBLIC_SUPABASE_URL is required`
- **Causa**: No se ha creado el archivo `.env.local` o el nombre de la variable de entorno está mal escrito.
- **Solución**: Verificar el nombre exacto de la variable en `.env.local` en la raíz de `my-app/`.

### 2. El servidor no detecta los cambios en `.env.local`
- **Causa**: Next.js lee las variables de entorno únicamente al iniciar el proceso del servidor.
- **Solución**: Detener la terminal (`Ctrl + C`) y reiniciar el servidor de desarrollo con `npm run dev`.

### 3. `new row violates row-level security policy`
- **Causa**: Se intenta insertar o leer datos de una tabla en Supabase que tiene activado *Row Level Security (RLS)* sin tener definidas las políticas de acceso oportunas para usuarios anónimos.
- **Solución**: Configurar las políticas RLS (*Policies*) en el panel web de Supabase para permitir lecturas o inserciones públicas.

---

## 25. Prácticas de seguridad: Qué NO hacer

- ❌ **NO publicar ni subir claves privadas** (*service_role keys*) en el repositorio.
- ❌ **NO subir el archivo `.env.local` a GitHub**.
- ❌ **NO escribir credenciales o URLs estáticas de forma dura (*hardcoded*)** directamente dentro de los componentes `.tsx`.
- ❌ **NO desactivar las políticas de seguridad en producción** sin comprender los riesgos de acceso no autorizado.

---

## 26. Estado actual de Supabase en este proyecto

Tras la inspección completa del código fuente, se resume el estado de implementación de los servicios de Supabase en el repositorio:

### Implementado
- [x] Cliente centralizado en [`src/lib/supabase.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/lib/supabase.ts).
- [x] Lectura de registros de la tabla `reportes` (en `MapView.tsx` y `test-db/page.tsx`).
- [x] Lectura de noticias de la tabla `noticias_historicas` (en `MapView.tsx`).
- [x] Inserción de nuevos registros en la tabla `reportes` (en `ReportForm.tsx`).
- [x] Almacenamiento remoto de imágenes en Supabase Storage (bucket `'reportes'`).
- [x] Configuración del dominio de imágenes de Supabase en `next.config.ts`.

### No implementado / Excluido
- [ ] **Autenticación de usuarios (*Supabase Auth*)**: La aplicación es 100% pública y no requiere inicio de sesión.
- [ ] **Funciones personalizadas (*RPC / Database Functions*)**: No se registran invocaciones a procedimientos almacenados en el código.
- [ ] **Suscripciones en tiempo real (*Realtime Subscriptions*)**: Las lecturas se ejecutan mediante consultas bajo demanda (*fetch*) al cargar los componentes.

---

## 27. Tabla de archivos relacionados con Supabase en el proyecto

| Archivo | Ruta | Función principal |
| :--- | :--- | :--- |
| **`supabase.ts`** | [`src/lib/supabase.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/lib/supabase.ts) | Inicialización central del cliente de Supabase consumiendo `.env.local`. |
| **`MapView.tsx`** | [`src/components/MapView.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/MapView.tsx) | Lectura asíncrona de las tablas `reportes` y `noticias_historicas`. |
| **`ReportForm.tsx`** | [`src/components/ReportForm.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/components/ReportForm.tsx) | Subida de imágenes a Supabase Storage e inserción SQL en la tabla `reportes`. |
| **`test-db/page.tsx`** | [`app/test-db/page.tsx`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/app/test-db/page.tsx) | Vista técnica de comprobación de conexión y lectura de datos. |
| **`next.config.ts`** | [`next.config.ts`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/next.config.ts) | Autorización del dominio de la API de Supabase para renderizado de imágenes. |

---

## 28. Ayuda memoria

### Conceptos clave

- **Supabase**: Plataforma Backend-as-a-Service (BaaS).
- **PostgreSQL**: Base de datos relacional donde se guardan los datos.
- **Storage**: Sistema para guardar archivos e imágenes en *buckets*.
- **Cliente Supabase**: Instancia exportada desde `src/lib/supabase.ts` para conectar Next.js con la nube.

### Variables de entorno necesarias (sin valores)

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Operaciones principales en código

- **`supabase.from('tabla').select('*')`**: Leer todos los registros.
- **`supabase.from('tabla').insert({...})`**: Insertar un nuevo registro.
- **`supabase.storage.from('bucket').upload(path, file)`**: Subir un archivo físico a Storage.
- **`supabase.storage.from('bucket').getPublicUrl(path)`**: Obtener la URL pública de una imagen.

---

## 29. Resultado final del capítulo

Al finalizar la lectura de este capítulo, cualquier lector o evaluador es capaz de:

1. Comprender el rol de Supabase como backend relacional y de almacenamiento del proyecto.
2. Identificar el cliente de conexión en `src/lib/supabase.ts` y sus variables de entorno asociadas.
3. Explicar cómo los componentes de React (`MapView` y `ReportForm`) consultan, insertan datos y suben fotografías.
4. Entender los mecanismos de seguridad que impiden la publicación de credenciales privadas a través de `.gitignore`.
