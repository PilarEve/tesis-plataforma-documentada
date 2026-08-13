# Capítulo 03: Creación del Proyecto Next.js desde Cero

Este documento constituye la guía práctica y conceptual para la inicialización y ejecución del proyecto web utilizando **Next.js**. Está diseñado para una persona que ya preparó su entorno de desarrollo en el capítulo anterior y desea aprender a crear una aplicación limpia, comprender la estructura generada por el instalador oficial e iniciar el servidor de desarrollo en su máquina local.

---

## 1. Objetivo del capítulo

El objetivo de este capítulo es enseñar cómo crear una aplicación web con Next.js desde cero utilizando la terminal de comandos, ejecutarla localmente en un navegador web y comprender el propósito de los primeros archivos y carpetas generados.

En este capítulo **nos enfocaremos exclusivamente en la estructura base de Next.js**. Todavía no configuraremos servicios externos como Supabase, ni librerías cartográficas como Leaflet, ni los módulos de reportes o estaciones de la tesis. Estas herramientas se integrarán de forma progresiva en los capítulos posteriores sobre la base limpia que crearemos aquí.

---

## 2. Elegir dónde crear el proyecto

Antes de ejecutar cualquier comando de creación, es indispensable posicionarse en una carpeta de trabajo ordenada en el disco duro.

### Organización conceptual de directorios

Se recomienda contar con una carpeta principal o contenedora donde se almacenen los proyectos de desarrollo. Por ejemplo:

```text
Documentos (Carpeta del usuario)
 └── Tesis (Carpeta contenedora)
      └── my-app (Carpeta raíz que contendrá el proyecto Next.js)
```

En este esquema:
- **`Tesis`** actúa como la carpeta contenedora o carpeta madre.
- **`my-app`** será la carpeta específica generada por el comando de creación del proyecto.

### Comprobar la ubicación inicial en la terminal

Abre tu terminal de comandos y verifica dónde estás posicionado mediante:

1. **Consultar la ruta actual**:
   ```powershell
   pwd
   ```
   - **¿Qué hace el comando?**: Muestra la ruta completa de la carpeta actual.
   - **Resultado esperado**:
     ```powershell
     Path
     ----
     C:\Users\Usuario\Documents\Tesis
     ```

2. **Listar el contenido de la carpeta contenedora**:
   ```powershell
   dir
   ```
   - **¿Qué hace el comando?**: Muestra los archivos y subcarpetas existentes dentro de la ubicación actual para asegurar que estás en el lugar correcto antes de iniciar la creación.

---

## 3. Abrir PowerShell en la carpeta correcta

Para interactuar con el sistema de archivos mediante comandos, dispones de tres alternativas sencillas en Windows:

1. **Terminal integrada del editor (Recomendado)**: Abre el editor de código (VS Code / Antigravity), abre la carpeta contenedora (`Tesis`) y abre una nueva terminal desde el menú **Terminal -> Nueva terminal**.
2. **Navegar desde PowerShell**: Abre PowerShell desde el menú Inicio y utiliza el comando `cd` para ingresar a tu carpeta:
   ```powershell
   cd C:\Users\Usuario\Documents\Tesis
   ```
3. **Desde el Explorador de archivos**: Abre la carpeta `Tesis` en Windows, haz clic derecho en un espacio vacío y selecciona *"Abrir en Terminal"* o *"Abrir ventana de PowerShell aquí"*.

### Interpretación del Prompt de la terminal

Cuando la terminal esté lista en la carpeta contenedora, observarás una ruta como:

```powershell
PS C:\Users\Usuario\Documents\Tesis>
```

- **`PS`**: Entorno PowerShell.
- **`C:\Users\Usuario\Documents\Tesis\`**: Carpeta contenedora activa.
- **`>`**: Indicador de escritura.

> [!IMPORTANT]
> Es crucial asegurarse de estar en la carpeta contenedora deseada antes de ejecutar el comando de inicialización. Crear un proyecto en una ubicación incorrecta (como directamente en `C:\` o en la carpeta raíz del usuario) dificultará su posterior localización y organización.

---

## 4. Crear el proyecto con create-next-app

El equipo de Next.js proporciona un asistente oficial de inicialización automatizada llamado `create-next-app`.

### Comando de creación

Para iniciar el asistente interactivo, se utiliza el siguiente comando:

```bash
npx create-next-app@latest
```

### Desglose explicativo del comando

1. **`npx`**: Es el ejecutor de paquetes de Node.js. Permite descargar y ejecutar la última versión de la herramienta de instalación sin dejar paquetes globales instalados permanentemente en tu computadora.
2. **`create-next-app`**: Es el nombre del paquete oficial creado por Vercel para andamiar (*scaffold*) aplicaciones Next.js con todas sus configuraciones esenciales.
3. **`@latest`**: Indica que se debe utilizar la versión más reciente disponible de Next.js en el registro de npm.

### ¿Qué ocurrirá después de presionar Enter?

Al ejecutar el comando, la terminal iniciará un cuestionario interactivo donde te realizará una serie de preguntas de configuración para personalizar las características técnicas de la aplicación.

---

## 5. Nombre del proyecto

La primera pregunta del asistente será solicitar el nombre de la carpeta donde se creará la aplicación:

```text
✔ What is your project named? … my-app
```

### Explicación técnica

- Si escribes `my-app` (o el nombre elegido para tu proyecto) y presionas `Enter`, el instalador creará automáticamente una subcarpeta llamada `my-app/` dentro de la carpeta contenedora.
- Esta subcarpeta `my-app/` se convertirá en la **raíz del proyecto**, conteniendo todos sus archivos fuente, archivos de configuración e historiales.

---

## 6. Opciones del instalador

A continuación, el asistente presentará varias preguntas técnicas. Las opciones seleccionadas en este proyecto de tesis se detallan a continuación, justificando su elección según la inspección del código fuente real del proyecto.

> [!NOTE]
> Las preguntas exactas y su orden pueden variar ligeramente según la versión de `create-next-app` que se encuentre activa en ese momento. No te preocupes si el texto difiere levemente en pantalla.

---

### Pregunta 1: Uso de TypeScript

```text
✔ Would you like to use TypeScript? … Yes / No
```

- **Opción seleccionada**: **`Yes`**
- **¿Qué significa?**: Añade soporte nativo para **TypeScript**, un lenguaje basado en JavaScript que agrega tipos estáticos a variables, funciones y componentes.
- **Justificación en el proyecto**: Al inspeccionar el código del proyecto comprobamos la presencia de `tsconfig.json` y dependencias como `@types/node` y `typescript ^5`. TypeScript previene errores en tiempo de desarrollo al validar los tipos de datos en componentes como el mapa o los formularios de reportes.

---

### Pregunta 2: Uso de ESLint

```text
✔ Would you like to use ESLint? … Yes / No
```

- **Opción seleccionada**: **`Yes`**
- **¿Qué significa?**: Incluye **ESLint**, una herramienta de análisis estático de código que detecta patrones de código problemáticos, errores de sintaxis o malas prácticas antes de ejecutar la aplicación.
- **Justificación en el proyecto**: El proyecto cuenta con `eslint.config.mjs` y `eslint-config-next`, garantizando que el código mantenga un estándar uniforme y libre de advertencias críticas.

---

### Pregunta 3: Uso de Tailwind CSS

```text
✔ Would you like to use Tailwind CSS? … Yes / No
```

- **Opción seleccionada**: **`Yes`**
- **¿Qué significa?**: Integra el marco de trabajo de estilos **Tailwind CSS**, que permite diseñar interfaces modernas y adaptables (*responsive*) mediante clases de utilidad directamente en los componentes.
- **Justificación en el proyecto**: Verificado en `package.json` mediante `tailwindcss ^4` y `@tailwindcss/postcss`, junto con `postcss.config.mjs`. Facilita la construcción ágil de paneles de control, formularios y visores cartográficos.

---

### Pregunta 4: Estructura de código dentro del directorio `src/`

```text
✔ Would you like to use `src/` directory? … Yes / No
```

- **Opción seleccionada**: **`Yes`** (o soporte híbrido)
- **¿Qué significa?**: Organiza el código fuente de la aplicación dentro de un directorio dedicado llamado `src/`, separándolo de los archivos de configuración raíz.
- **Justificación en el proyecto**: Al inspeccionar el proyecto actual, se observa que la carpeta `src/` se utiliza para alojar componentes reutilizables (`src/components/`), librerías de conexión (`src/lib/`) y definiciones de tipos (`src/types/`), mientras que las rutas principales del sistema residen en el App Router (`app/`).

---

### Pregunta 5: Uso del App Router

```text
✔ Would you like to use App Router? (recommended) … Yes / No
```

- **Opción seleccionada**: **`Yes`**
- **¿Qué significa?**: Habilita el sistema de enrutamiento moderno de Next.js basado en la carpeta `app/`, que soporta *Server Components*, layouts anidados y renderizado optimizado.
- **Justificación en el proyecto**: La aplicación utiliza el App Router con rutas estructuradas en carpetas como `app/page.tsx` para la vista principal del mapa y `app/estaciones/page.tsx` para el panel de sensores.

---

### Pregunta 6: Alias de importación (*Import Alias*)

```text
✔ Would you like to customize the default import alias (@/*)? … No / Yes
```

- **Opción seleccionada**: **`No`** (Aceptar la sugerencia predeterminada `@/*`)
- **¿Qué significa?**: Permite importar archivos dentro del proyecto utilizando un atajo limpio como `@/components/MapView` en lugar de rutas relativas complejas como `../../components/MapView`.
- **Justificación en el proyecto**: Comprobado en `tsconfig.json` bajo la regla `"paths": { "@/*": ["./src/*"] }`.

---

## 7. Esperar la instalación

Una vez respondidas todas las preguntas, el asistente iniciará el proceso de instalación automática.

```text
Creating a new Next.js app in C:\Users\Usuario\Documents\Tesis\my-app.

Using npm.

Initializing project with template: app-tw 

Installing dependencies:
- react
- react-dom
- next
- typescript
- @types/node
- @types/react
- @types/react-dom
- tailwindcss
- eslint
- eslint-config-next

Success! Created my-app at C:\Users\Usuario\Documents\Tesis\my-app
```

### ¿Qué sucede internamente durante este paso?

1. **Creación de estructura de directorios**: Se crean las carpetas principales (`app/`, `public/`, `src/`).
2. **Generación de archivos de configuración**: Se escriben los archivos `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, entre otros.
3. **Descarga e instalación de paquetes**: `npm` descarga automáticamente React, Next.js y todas las dependencias necesarias desde Internet.
4. **Creación del directorio `node_modules`**: Se almacenan miles de archivos pertenecientes a las librerías descargadas.

> [!WARNING]
> La carpeta `node_modules` generada durante la instalación suele pesar más de 200 MB y contener decenas de miles de archivos pequeños. **Esta carpeta nunca debe subirse al repositorio de GitHub**, por lo que el instalador la incluye de forma predeterminada dentro del archivo `.gitignore`.

---

## 8. Entrar en la carpeta del proyecto

Una vez finalizada la instalación exitosamente, debes ingresar a la carpeta recién creada para comenzar a trabajar.

### Comando de navegación

```powershell
cd my-app
```

- **¿Qué hace el comando?**: Traslada la posición interactiva de la terminal al interior de la carpeta del proyecto `my-app`.
- **Dónde debe ejecutarse**: En la carpeta contenedora (`Tesis`).
- **Resultado esperado**: El prompt de la terminal reflejará el cambio de ubicación:

```powershell
PS C:\Users\Usuario\Documents\Tesis\my-app>
```

> [!IMPORTANT]
> Todos los comandos futuros de desarrollo (como iniciar el servidor o instalar librerías) deben ejecutarse **obligatoriamente dentro de la carpeta raíz del proyecto** (`my-app`), donde se encuentra ubicado el archivo `package.json`.

---

## 9. Verificar el contenido del proyecto

Una vez dentro de la carpeta `my-app`, verifica la estructura inicial de archivos generada ejecutando:

```powershell
dir
```

- **¿Qué hace el comando?**: Muestra los elementos creados en la raíz del proyecto.
- **Resultado esperado**: Deberías visualizar una lista similar a la siguiente:

```text
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        13/08/2026     00:10                .next
d-----        13/08/2026     00:10                app
d-----        13/08/2026     00:10                node_modules
d-----        13/08/2026     00:10                public
d-----        13/08/2026     00:10                src
-a----        13/08/2026     00:10            480 .gitignore
-a----        13/08/2026     00:10            465 eslint.config.mjs
-a----        13/08/2026     00:10            434 next.config.ts
-a----        13/08/2026     00:10         238077 package-lock.json
-a----        13/08/2026     00:10            782 package.json
-a----        13/08/2026     00:10             94 postcss.config.mjs
-a----        13/08/2026     00:10            670 tsconfig.json
```

*(Nota: El tamaño exacto y la fecha variarán según la ejecución).*

---

## 10. package.json

El archivo **`package.json`** es el corazón operativo de cualquier proyecto basado en Node.js y JavaScript.

### ¿Qué es y para qué sirve?

Es un archivo de texto en formato JSON que actúa como la cédula de identidad del proyecto. Describe su nombre, versión, scripts de comandos ejecutables y la lista detallada de todas las dependencias y librerías que el sistema necesita para funcionar.

### Estructura inicial del archivo

Al abrir `package.json` en un nuevo proyecto de Next.js, encontrarás una estructura similar a la siguiente:

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.2.4",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### Elemento clave: El script `dev`

Observa la sección `"scripts"`:
- `"dev": "next dev"` define un acceso directo.
- Al ejecutar en la terminal el comando `npm run dev`, `npm` buscará la clave `"dev"` y ejecutará internamente la orden `next dev`, iniciando el servidor local de desarrollo.

---

## 11. Ejecutar el proyecto

Con el entorno preparado y el proyecto creado, es momento de poner en marcha la aplicación por primera vez.

### Comando de ejecución

Asegúrate de estar en la carpeta `my-app` y ejecuta:

```bash
npm run dev
```

### Explicación paso por paso de lo que ocurre

1. **Lectura de configuración**: `npm` lee el archivo `package.json` en la carpeta actual.
2. **Localización del script**: Encuentra el script denominado `dev` asociado a `next dev`.
3. **Inicio de compilación**: Next.js compila los archivos de TypeScript y procesa los estilos en memoria.
4. **Lanzamiento del servidor**: Se inicia un servidor web HTTP local en la computadora.

### Resultado esperado en la terminal

Tras unos segundos, la terminal mostrará un mensaje indicando que el servidor está activo:

```text
  ▲ Next.js 16.2.4
  - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 1.8s
```

---

## 12. Qué es localhost

Cuando el servidor de desarrollo se inicia, la terminal indica que la aplicación está disponible en `http://localhost:3000`.

### Conceptos fundamentales

- **`localhost`**: Es una palabra clave reservada del sistema de redes que significa *"esta misma computadora"*. La dirección IP asociada a localhost es `127.0.0.1`.
- **Puerto (`3000`)**: En networking, un puerto es un canal o puerta lógica numerada a través de la cual un servicio de red envía y recibe datos. El puerto `3000` es el canal predeterminado utilizado por Next.js para servir la web en desarrollo.

### Comparación analógica

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          LOCAL vs PRODUCCIÓN                           │
├───────────────────────────────────┬────────────────────────────────────┤
│         http://localhost:3000     │      https://mi-tesis.vercel.app   │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Se ejecuta en tu computadora.   │ • Se ejecuta en servidores nube.   │
│ • Solo tú puedes acceder a ella.  │ • Acceso público global.           │
│ • Para pruebas y desarrollo.      │ • Para usuarios finales.           │
└───────────────────────────────────┴────────────────────────────────────┘
```

> [!NOTE]
> Si el puerto `3000` ya se encuentra ocupado por otra aplicación en tu equipo, Next.js seleccionará automáticamente el siguiente puerto disponible (por ejemplo, `http://localhost:3001`). Lee siempre el mensaje impreso en la terminal para confirmar el puerto exacto.

---

## 13. Abrir la primera página

Para visualizar la aplicación en funcionamiento:

1. Abre tu navegador web (Google Chrome, Firefox, Edge).
2. Haz clic en la barra de direcciones superior.
3. Escribe `http://localhost:3000` y presiona `Enter`.

### Resultado esperado en la pantalla

Verás la página de bienvenida predeterminada creada por el equipo de Next.js, que incluye el logotipo de la plataforma, enlaces a documentación básica y recomendaciones para comenzar a modificar el código.

### Actualización automática (*Hot Reloading*)

Mientras el comando `npm run dev` permanezca activo en la terminal, cualquier cambio que realices en el código fuente de los archivos (por ejemplo en `app/page.tsx`) se compilará instantáneamente y se reflejará en la pantalla del navegador sin necesidad de recargar manualmente la página.

---

## 14. Detener el servidor

Cuando termines tu jornada de trabajo o necesites ejecutar otros comandos en la misma terminal, debes detener el servidor de desarrollo.

### Comando para detener la ejecución

En la ventana de la terminal donde está corriendo el servidor, presiona la combinación de teclas:

```text
Ctrl + C
```

- **¿Qué hace la combinación?**: Envía una señal de interrupción al proceso en segundo plano, deteniendo el servidor web local de Next.js.
- **Resultado esperado**: La terminal te preguntará si deseas terminar el trabajo o simplemente volverá a mostrar el prompt de escritura habitual (`PS C:\Users\Usuario\Documents\Tesis\my-app>`).

> [!NOTE]
> Detener el servidor **NO elimina ni daña tu proyecto**. Todo el código y los archivos permanecen intactos en el disco duro. Para volver a trabajar al día siguiente, solo debes abrir la terminal en la carpeta `my-app` y ejecutar nuevamente `npm run dev`.

---

## 15. Error importante: package.json no encontrado

Uno de los errores más comunes para quienes comienzan en el desarrollo web es intentar iniciar el servidor desde la carpeta equivocada.

### Mensaje de error típico

```text
npm error enoent Could not read package.json: ENOENT: no such file or directory, open 'C:\Users\Usuario\Documents\Tesis\package.json'
npm error enoent This is related to npm not being able to find a file.
```

### Diagnóstico de causa raíz

Este mensaje **NO significa que el proyecto se haya borrado o esté roto**. Ocurre porque ejecutaste el comando `npm run dev` estando posicionado en la carpeta contenedora (`Tesis`) en lugar de estar dentro de la carpeta raíz de la aplicación (`my-app`), donde reside el archivo `package.json`.

### Procedimiento paso a paso para solucionarlo

1. **Verifica tu ubicación actual**:
   ```powershell
   pwd
   ```
2. **Inspecciona las subcarpetas disponibles**:
   ```powershell
   dir
   ```
3. **Ingresa a la carpeta correcta del proyecto**:
   ```powershell
   cd my-app
   ```
4. **Vuelve a ejecutar el servidor**:
   ```bash
   npm run dev
   ```

---

## 16. node_modules y reconstrucción de dependencias

Es imprescindible comprender el rol y comportamiento de la carpeta `node_modules`.

### Características de `node_modules`

- **Contenido**: Almacena el código fuente ejecutable de miles de paquetes y librerías externas necesarias para que Next.js, React y TypeScript funcionen.
- **Tamaño elevado**: Contiene una enorme cantidad de archivos pequeños que pueden ralentizar la copia o transmisión de la carpeta entre discos.
- **Exclusión en Git**: Se incluye siempre en el archivo `.gitignore` para no saturar los repositorios remotos en GitHub.

### Reconstrucción con `npm install`

Si clonas el proyecto desde GitHub en otra computadora o eliminas la carpeta `node_modules` para ahorrar espacio, no necesitas volver a crear el proyecto desde cero. Puedes reconstruir todas las dependencias ejecutando:

```bash
npm install
```

- **¿Qué hace el comando?**: Lee las listas registradas en `package.json` y `package-lock.json`, descarga exactamente los mismos paquetes desde el registro oficial de npm y recrea la carpeta `node_modules` en segundos.

```text
┌────────────────────────┐      npm install      ┌────────────────────────┐
│  package.json (Receta) ├──────────────────────>│ node_modules (Ingred.) │
└────────────────────────┘                       └────────────────────────┘
```

---

## 17. La carpeta compilada .next

Cuando ejecutas `npm run dev` o `npm run build`, Next.js crea automáticamente una carpeta oculta o de sistema llamada **`.next/`**.

### ¿Qué contiene la carpeta `.next`?

- Archivos de código compilado de TypeScript a JavaScript.
- Archivos de caché del compilador para acelerar la carga de la aplicación.
- Estilos CSS procesados.
- Fragmentos de páginas generadas dinámicamente.

### Consideraciones clave

- **No es código fuente**: No debes escribir ni modificar archivos manualmente dentro de `.next/`.
- **Generación automática**: Si borras la carpeta `.next/`, Next.js la volverá a generar automáticamente la próxima vez que inicies el servidor.
- **Ignorada en Git**: También está incluida en `.gitignore` para no subir archivos temporales de compilación al repositorio.

---

## 18. Archivos importantes creados inicialmente

A continuación se resume la función de los archivos principales creados en la raíz de un nuevo proyecto Next.js:

| Archivo / Carpeta | Descripción y propósito en el proyecto |
| :--- | :--- |
| **`package.json`** | Lista los scripts, el nombre del proyecto y las dependencias (Next, React, Tailwind). |
| **`package-lock.json`** | Registra el árbol exacto con las versiones fijas de todas las sub-dependencias instaladas. |
| **`tsconfig.json`** | Configura las reglas de validación del compilador de TypeScript y alias de ruta (`@/*`). |
| **`next.config.ts`** | Archivo de configuración avanzada de Next.js (dominios de imágenes, redirecciones, etc.). |
| **`eslint.config.mjs`** | Reglas del linter para el control de calidad de código de TypeScript y React. |
| **`postcss.config.mjs`** | Configura los procesadores de CSS requeridos por Tailwind CSS. |
| **`public/`** | Carpeta para archivos estáticos accesibles directamente por la web (imágenes, favicons, fuentes). |
| **`app/`** | Directorio principal del App Router que contiene las páginas, rutas y layouts de la aplicación. |
| **`src/`** | Directorio para organizar componentes reutilizables, utilidades y librerías del sistema. |
| **`.gitignore`** | Lista los archivos y carpetas que Git debe ignorar (como `node_modules` y `.next`). |

---

## 19. Probar que el proyecto funciona correctamente

Realiza esta breve lista de verificación para confirmar que la creación y puesta en marcha del proyecto base fue totalmente exitosa:

- [ ] La terminal se encuentra posicíonada dentro de la carpeta del proyecto (`my-app`).
- [ ] El archivo `package.json` está presente al ejecutar `dir`.
- [ ] El comando `npm run dev` se ejecuta sin lanzar mensajes de error en rojo.
- [ ] La terminal muestra un puerto local activo (por ejemplo: `http://localhost:3000`).
- [ ] Puedes abrir el navegador web e ingresar a esa dirección visualizando la página de inicio.
- [ ] El servidor se detiene de forma limpia al presionar `Ctrl + C`.

---

## 20. Flujo resumido de trabajo

El proceso completo para inicializar un proyecto Next.js se resume en la siguiente secuencia lógica de pasos:

```text
┌───────────────────────────────────────────┐
│ 1. Crear/Navegar a carpeta contenedora    │  cd C:\Users\Usuario\Documents\Tesis
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│ 2. Ejecutar asistente de creación         │  npx create-next-app@latest
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│ 3. Seleccionar opciones (TS, Tailwind...) │  Escribir 'my-app' y seleccionar 'Yes'
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│ 4. Esperar descarga e instalación         │  Creación de node_modules y package.json
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│ 5. Ingresar a la carpeta del proyecto     │  cd my-app
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│ 6. Iniciar el servidor de desarrollo      │  npm run dev
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│ 7. Abrir navegador e inspeccionar web     │  http://localhost:3000
└───────────────────────────────────────────┘
```

---

## 21. Errores frecuentes

### 1. Ejecutar `npm run dev` fuera de la carpeta del proyecto
- **Solución**: Revisa tu ubicación con `pwd` e ingresa a la carpeta adecuada mediante `cd my-app`.

### 2. `npx` o `npm` no se reconoce como un comando
- **Solución**: Remítete al *Capítulo 02: Preparación del Entorno de Desarrollo* para verificar que Node.js esté instalado y su ruta registrada en la variable PATH del sistema.

### 3. El puerto 3000 se encuentra ocupado
- **Solución**: Next.js intentará usar automáticamente `http://localhost:3001`. Si deseas liberar el puerto 3000, cierra la otra ventana de terminal o proceso Node que esté corriendo en segundo plano.

### 4. La instalación tarda demasiado tiempo
- **Solución**: La descarga inicial de dependencias depende de la velocidad de tu conexión a Internet. Es normal que la primera instalación demore un par de minutos.

### 5. `node_modules` ocupa mucho espacio en disco
- **Solución**: Es el comportamiento normal de los entornos Node.js debido a la modularidad del ecosistema de JavaScript. No intentes borrar archivos individuales dentro de esa carpeta.

---

## 22. Ayuda memoria

### Comandos fundamentales del capítulo

- **`pwd`**: Muestra la ruta completa de la carpeta actual donde está trabajando la terminal.
- **`dir`**: Lista los archivos y carpetas contenidos en la ubicación actual.
- **`npx create-next-app@latest`**: Ejecuta el asistente interactivo oficial para crear un nuevo proyecto Next.js.
- **`cd my-app`**: Ingresa a la carpeta raíz del proyecto para poder trabajar en él.
- **`npm run dev`**: Inicia el servidor local de desarrollo de Next.js.
- **`Ctrl + C`**: Detiene la ejecución del servidor local en la terminal.
- **`npm install`**: Reinstala todas las dependencias listadas en `package.json` cuando se clona un proyecto.

---

## 23. Resultado final del capítulo

Al finalizar los pasos descritos en este capítulo, habrás logrado:

1. Crear la carpeta raíz del proyecto `my-app` mediante el instalador oficial de Next.js.
2. Configurar la base técnica del proyecto con TypeScript, Tailwind CSS, ESLint y App Router.
3. Instalar las dependencias iniciales y generar el archivo `package.json`.
4. Iniciar el servidor local de desarrollo y visualizar la primera página web base en `http://localhost:3000`.

*(Aclaración final: Esta aplicación inicial constituye el lienzo limpio sobre el cual construiremos progresivamente los componentes, la base de datos Supabase, los mapas con Leaflet y la lógica de la tesis en los capítulos siguientes).*
