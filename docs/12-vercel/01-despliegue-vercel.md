# CAPÍTULO 12 · DESPLIEGUE DE LA PLATAFORMA CON VERCEL

---

## 1. OBJETIVO DEL CAPÍTULO

El objetivo principal de este capítulo es documentar de forma clara, metódica y conceptual cómo la plataforma web desarrollada en Next.js —que opera y se prueba localmente durante la fase de desarrollo— se publica en Internet para su acceso global mediante la plataforma **Vercel**.

A través de este capítulo se busca comprender integralmente:
* La **diferencia operativa** entre el entorno de desarrollo local y el entorno de producción en la nube.
* El **papel esencial de GitHub** como repositorio centralizado y puente hacia el despliegue automático.
* El **rol de Vercel** como infraestructura de hosting, compilación (*build*) y distribución global.
* El proceso paso a paso para **importar un repositorio**, configurar la compilación y gestionar **variables de entorno**.
* La forma en que se obtiene una **URL pública** segura de forma automática.
* El comportamiento del ciclo de vida continuo (*CI/CD*) cuando se realiza un nuevo envío de código (`git push`) al repositorio de GitHub.

---

## 2. ¿QUÉ SIGNIFICA DESPLEGAR?

En el ámbito del desarrollo de software, el término **despliegue** (o *deployment*) se refiere a todo el conjunto de actividades que hacen que una aplicación informática esté disponible para su uso por parte de los usuarios finales en un servidor o infraestructura remota.

Para entender este concepto con claridad, podemos utilizar una comparación directa:

* **`localhost` (Desarrollo Local):** La aplicación web se ejecuta únicamente en la memoria y procesador de la computadora personal del desarrollador (por ejemplo, en la dirección `http://localhost:3000`). Solamente la persona sentada frente a esa computadora o conectada a su red local puede visualizar e interactuar con el sistema.
* **Vercel (Producción / Despliegue en la Nube):** La aplicación compilada y sus activos estáticos se transfieren a una red global de servidores (*Edge Network*). La aplicación se ejecuta en una infraestructura remota de alto rendimiento accesible desde cualquier parte del mundo mediante una URL pública universal (por ejemplo, `https://...vercel.app`).

---

## 3. DESARROLLO VS PRODUCCIÓN

Existen marcadas diferencias técnicas e operativas entre el entorno de desarrollo donde construimos el código y el entorno de producción donde los usuarios consumen la plataforma:

| Aspecto | Desarrollo local | Producción |
| :--- | :--- | :--- |
| **Acceso / Dirección** | `localhost:3000` (privado) | URL pública con HTTPS (global) |
| **Comando de ejecución** | `npm run dev` | `npm run build` + `deployment` |
| **Entorno de ejecución** | Computadora del desarrollador | Servidor / Plataforma remota (Vercel) |
| **Naturaleza de los cambios** | Pruebas instantáneas, *Hot Reload* | Versión estable compilada y publicada |
| **Optimizaciones** | Desactivadas para facilitar el *debugging* | Minificación, compresión e imágenes optimizadas |

En el contexto de nuestro proyecto `my-app`, el desarrollo local nos permite probar nuevas funciones de visualización de eventos y mapas de forma interactiva, mientras que la producción genera una versión altamente optimizada, segura y rápida lista para la ciudadanía o los tomadores de decisiones.

---

## 4. ¿QUÉ ES VERCEL?

**Vercel** es una plataforma de nube diseñada específicamente para alojar aplicaciones web modernas, optimizada de forma nativa para el framework **Next.js** (creadores del propio framework).

En lugar de requerir una configuración compleja y manual de servidores web tradicionales (como Apache o Nginx), configuración de certificados SSL o mantenimiento del sistema operativo, Vercel automatiza todo el proceso enfocándose en:

1. **Despliegue e Integración Continua (CI/CD):** Se conecta directamente con GitHub para detectar cuando hay cambios listos para publicar.
2. **Proceso de Compilación (*Build*):** Ejecuta automáticamente los scripts de empaquetado para convertir el código TypeScript y React en un paquete web de produccion eficiente.
3. **Hosting y Red de Distribución (CDN):** Servidores distribuidos globalmente que garantizan bajas latencias de carga.
4. **Gestión de Variables de Entorno:** Almacenamiento seguro de llaves de acceso a servicios externos (como Supabase) sin exponerlas en el código fuente público.
5. **Generación de URLs Públicas:** Provisión automática de dominios con certificado de seguridad HTTPS.

---

## 5. ARQUITECTURA DEL DESPLIEGUE

El flujo que sigue el código fuente desde el momento en que se escribe en el editor hasta que un usuario final accede a la plataforma desplegada se representa en el siguiente esquema:

```text
DESARROLLADOR
     ↓
Código local (my-app)
     ↓
Git (Control de versiones)
     ↓
GitHub (Repositorio remoto)
     ↓
Vercel (Integración continua)
     ↓
Build (Compilación de producción)
     ↓
Deployment (Distribución en CDN)
     ↓
URL pública (https://...vercel.app)
     ↓
Usuario (Navegador web)
```

**Relación con nuestro proyecto:**
El desarrollador trabaja dentro del directorio local [my-app](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app). Al guardar sus avances, registra los cambios con Git y los envía a GitHub. Vercel detecta instantáneamente la actualización en GitHub, descarga el nuevo código, ejecuta `npm run build`, asigna las variables de entorno necesarias para la base de datos Supabase y publica la nueva versión en la URL pública del proyecto.

---

## 6. REQUISITOS PREVIOS

Antes de iniciar el despliegue de la aplicación en Vercel, es indispensable confirmar que se cumplen los siguientes requisitos técnicos:

* **Proyecto Next.js funcional:** La aplicación dentro de `my-app` debe ejecutar sin errores críticos de sintaxis o renderizado.
* **Archivo [package.json](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json):** Debe estar correctamente estructurado con las dependencias necesarias y los scripts de ejecución (`dev`, `build`, `start`).
* **Repositorio Git local:** El historial de cambios del proyecto debe estar inicializado y actualizado.
* **Proyecto subido a GitHub:** El código fuente debe estar sincronizado en un repositorio remoto (público o privado) en la plataforma GitHub.
* **Cuenta activa en Vercel:** Contar con un usuario registrado en Vercel (preferentemente vinculado a la cuenta de GitHub).
* **Variables de entorno identificadas:** Conocer el nombre de las credenciales necesarias para conectar el frontend con servicios externos.
* **Proyecto de Supabase accesible:** Contar con la URL del proyecto y la clave anónima (`anon key`) activas en la consola de Supabase.

---

## 7. COMPROBAR LOCALMENTE ANTES DE DESPLEGAR

Antes de publicar cualquier aplicación en Internet, es una buena práctica de ingeniería de software realizar verificaciones en la máquina local.

En nuestro proyecto `my-app`, el archivo [package.json](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json) define los siguientes scripts principales:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

* **`npm run dev`:** Inicia el servidor de desarrollo local de Next.js (`next dev`). Incluye la función de recarga en tiempo real (*Fast Refresh*) y muestra advertencias detalladas en la consola del navegador.
* **`npm run build`:** Ejecuta la compilación de producción (`next build`). Transpila el código TypeScript, verifica los tipos, analiza los componentes de React y empaqueta la aplicación en la carpeta `.next`.
* **`npm run start`:** Ejecuta el servidor de producción localmente utilizando la versión compilada previamente por `npm run build`.

---

## 8. `npm run build`

El comando `npm run build` es el paso crucial previo al despliegue. A diferencia del entorno de desarrollo (`npm run dev`), donde Next.js tolera ciertos errores menores para agilizar el flujo de trabajo, la compilación de producción aplica comprobaciones estrictas:

* **Verificación de tipos TypeScript:** Garantiza que no existan inconsistencias en las definiciones de interfaces, tipos de datos o imports de módulos.
* **Detección de errores de sintaxis y sintaxis JSX:** Analiza que todos los componentes cierren sus etiquetas y cumplan con las reglas de React 19.
* **Optimización de recursos:** Empaqueta y minifica el código JavaScript y CSS para asegurar una rápida velocidad de carga.

**Por qué es útil detectar errores antes del deployment:**
Si ejecutamos `npm run build` localmente y el proceso se completa de forma exitosa, tenemos un alto grado de certeza de que el despliegue en Vercel no fallará durante la fase de compilación. Si existen errores de compilación, es preferible resolverlos localmente antes de forzar un fallo en los servidores remotos.

---

## 9. GITHUB COMO FUENTE DEL DESPLIEGUE

Vercel no requiere que subamos manualmente archivos `.zip` o carpetas compiladas desde nuestra computadora. En su lugar, utiliza **GitHub como la fuente de verdad** del proyecto.

```text
GitHub (Repositorio)
   ↓
Vercel lee el código automáticamente
   ↓
Ejecuta 'npm run build' en la nube
   ↓
Genera el deployment final
```

Esta integración ofrece enormes ventajas:
1. **Trazabilidad:** Cada despliegue en producción corresponde a un `commit` específico en el historial de Git.
2. **Automatización:** Cada vez que el desarrollador realiza un `git push` a GitHub, Vercel recibe una notificación (*webhook*) e inicia automáticamente una nueva compilación y despliegue sin intervención manual.

---

## 10. CREAR O ABRIR CUENTA EN VERCEL

El procedimiento conceptual para preparar la cuenta en la plataforma de Vercel es el siguiente:

1. Ingresar al portal oficial: `https://vercel.com`.
2. Seleccionar la opción **Sign Up** (o **Log In** si ya existe una cuenta).
3. Elegir la opción **Continue with GitHub**.
4. Autorizar a Vercel para que pueda acceder de forma segura a los repositorios de la cuenta de GitHub correspondiente.

> [!NOTE]
> No se deben registrar ni guardar credenciales de acceso personales o claves de cuenta dentro de la documentación del proyecto.

---

## 11. IMPORTAR PROYECTO

Una vez iniciada la sesión en el panel principal (*Dashboard*) de Vercel, el flujo conceptual para conectar la aplicación se realiza de la siguiente manera:

1. En el Dashboard, hacer clic en el botón **Add New...** y seleccionar **Project**.
2. En el listado **Import Git Repository**, buscar el repositorio correspondiente al proyecto (por ejemplo, referenciado conceptualmente como `tesis-plataforma-documentada` o según el nombre asignado en GitHub).
3. Hacer clic en el botón **Import** ubicado al lado del repositorio seleccionado.

---

## 12. DETECCIÓN DE NEXT.JS

Cuando Vercel analiza el repositorio importado, examina automáticamente la raíz del código fuente en busca de archivos clave como [package.json](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json).

Al detectar que en las dependencias se encuentra `"next": "16.2.4"`, la plataforma asigna automáticamente la configuración conocida como **Framework Preset**:

* **Framework Preset:** `Next.js`
* **Build Command (predeterminado):** `next build` (o `npm run build`)
* **Output Directory (predeterminado):** `.next`
* **Install Command (predeterminado):** `npm install`

Esta autodetección elimina la necesidad de escribir scripts de compilación complejos o archivos de configuración manuales para la plataforma.

---

## 13. ROOT DIRECTORY

El concepto de **Root Directory** (Directorio Raíz) es de vital importancia para garantizar el éxito del despliegue en Vercel.

En la estructura local de trabajo, el proyecto puede encontrarse dentro de una ruta anidada como:
`C:\Users\Usuario\Documents\Tesis - copia\my-app`

Sin embargo, cuando el repositorio de GitHub tiene como raíz el contenido directo de la aplicación o una estructura particular, Vercel debe saber exactamente en qué carpeta se encuentran las instrucciones de compilación.

> [!IMPORTANT]
> **Regla práctica fundamental:** La raíz de despliegue (*Root Directory*) en Vercel debe ser la carpeta exacta que contenga el archivo [package.json](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json).

Si en el repositorio remoto la carpeta raíz ya contiene [package.json](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json), el *Root Directory* en Vercel se deja en `./`. Si el repositorio contiene una subcarpeta (por ejemplo `my-app/`), se debe especificar esa subcarpeta en la casilla de configuración de Vercel.

---

## 14. BUILD COMMAND

Al verificar la sección `"scripts"` del archivo [package.json](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json) de nuestro proyecto, se confirma que el comando oficial de compilación es:

`npm run build`

Durante la ejecución de este comando por parte de Vercel en la nube:
1. Se invocan las herramientas de Next.js 16 (`next build`).
2. Se analizan todas las páginas, componentes React y estilos CSS (TailwindCSS v4).
3. Se verifican las llamadas a la base de datos y la validez de los tipos en TypeScript.
4. Se generan las rutas estáticas (*SSG*) y la lógica para el renderizado del lado del servidor (*SSR* / *Edge Functions*).

---

## 15. INSTALL COMMAND

Antes de poder ejecutar la compilación, Vercel necesita instalar todos los paquetes y librerías que la aplicación utiliza para funcionar (tales como `@supabase/supabase-js`, `leaflet`, `lucide-react`, `date-fns`, entre otros).

Para ello, Vercel ejecuta internamente el **Install Command**, que por defecto corresponde a:

`npm install` (o `npm ci`)

Este proceso se apoya estrictamente en dos archivos presentes en el repositorio:
* **[package.json](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json):** Especifica las dependencias requeridas y sus versiones compatibles.
* **`package-lock.json`:** Guarda la estructura exacta y las versiones detalladas de cada árbol de dependencias, garantizando que el entorno en la nube sea idéntico al local.

**¿Por qué `node_modules` no necesita subirse a GitHub?**
La carpeta `node_modules` contiene miles de archivos pesados específicos del sistema operativo local. No se sube al repositorio Git porque pesa cientos de megabytes y porque Vercel la reconstruye automáticamente y de forma más limpia en la nube ejecutando el comando de instalación a partir de `package-lock.json`.

---

## 16. OUTPUT

Durante el proceso de compilación, Next.js procesa todo el código fuente y crea una carpeta de distribución optimizada llamada:

`.next`

Esta carpeta incluye:
* Los paquetes de JavaScript minificados (*bundles*).
* Las páginas HTML pre-renderizadas.
* Las hojas de estilo CSS optimizadas.
* Las funciones de servidor (*Serverless Functions*) listas para ejecutarse en la nube.

**¿Por qué `.next` no se incluye en Git?**
La carpeta `.next` es un producto derivado y temporal de la compilación local. No se incluye en el repositorio de GitHub porque Vercel la vuelve a generar desde cero durante cada despliegue para asegurar que refleje exactamente el estado final del código.

---

## 17. VARIABLES DE ENTORNO

Esta sección representa uno de los aspectos más críticos de la seguridad y el funcionamiento del despliegue.

Al inspeccionar la plataforma `my-app`, se identificó que la conexión con el servicio de base de datos e identificadores depende estrictamente de las siguientes variables de entorno:

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`

En el entorno de desarrollo local, estas variables se leen desde el archivo [.env.local](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/.gitignore) (el cual está correctamente excluido de Git para proteger la confidencialidad).

Dado que el archivo `.env.local` **no se sube a GitHub**, la aplicación desplegada en Vercel fallará o no podrá comunicarse con la base de datos a menos que esas mismas variables se registren directamente en el panel de control de Vercel.

---

## 18. CONFIGURAR VARIABLES EN VERCEL

El procedimiento conceptual para configurar las variables de entorno en la plataforma Vercel se realiza mediante los siguientes pasos:

1. Dentro del proyecto en Vercel, navegar a **Settings** → **Environment Variables**.
2. En la casilla **Key / Name**, ingresar el nombre exacto de la variable (ej. `NEXT_PUBLIC_SUPABASE_URL`).
3. En la casilla **Value**, ingresar el valor correspondiente proporcionado por la consola de Supabase.
4. Seleccionar los entornos (*Environments*) donde se aplicará la variable:
   * **Production:** Para la versión pública oficial.
   * **Preview:** Para despliegues temporales de ramas o Pull Requests.
   * **Development:** Para entornos de desarrollo vinculados mediante Vercel CLI.
5. Hacer clic en **Save** o **Add**.
6. Repetir el proceso para `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

> [!WARNING]
> Nunca se deben escribir los valores reales o claves secretas en la documentación o código subido a Git. Los valores se ingresan únicamente en la interfaz protegida de Vercel.

---

## 19. SUPABASE + VERCEL

La integración entre la aplicación frontend desplegada en Vercel y el backend de datos en Supabase funciona mediante la siguiente arquitectura de comunicación:

```text
Aplicación desplegada (Vercel)
       ↓
Variables de entorno (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY)
       ↓
Cliente Supabase (src/lib/supabase.ts)
       ↓
Supabase Cloud (Base de datos PostgreSQL + API REST)
       ↓
Lectura / Escritura de Datos de Eventos
```

Al iniciarse la aplicación en la nube, el archivo [`src/lib/supabase.ts`](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/lib/supabase.ts) toma los valores inyectados por Vercel a través de `process.env.NEXT_PUBLIC_SUPABASE_URL` y `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`, inicializando la conexión segura con la base de datos remota.

---

## 20. PRIMER DEPLOYMENT

Con el repositorio importado, la raíz verificada y las variables de entorno registradas, se inicia el proceso del primer despliegue (*First Deployment*):

1. Hacer clic en el botón **Deploy** en el panel de configuración de Vercel.
2. Vercel inicia el flujo automatizado:
   * **Cloning repository:** Descarga el código fuente desde GitHub.
   * **Installing dependencies:** Ejecuta `npm install` para descargar los paquetes necesarios.
   * **Running build command:** Ejecuta `npm run build` para compilar Next.js.
   * **Assigning Domains:** Genera los dominios públicos seguros.
3. Al finalizar correctamente, el panel muestra una animación de felicitación y entrega la URL de producción accesible de forma inmediata.

---

## 21. LOGS DEL BUILD

Durante y después del proceso de despliegue, Vercel proporciona una consola de registro en vivo conocida como **Build Logs** (Registros de Compilación).

Los logs son herramientas fundamentales para la supervisión y resolución de problemas, ya que permiten auditar paso a paso el trabajo del servidor. Permiten identificar fallos comunes como:
* **Falta de dependencias:** Si una librería fue importada en el código pero no añadida a [package.json](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json).
* **Errores de TypeScript:** Tipos no coincidentes o variables no declaradas.
* **Variables de entorno ausentes:** Errores de compilación si el código requiere una variable obligatoria.
* **Rutas o imports incorrectos:** Inconsistencias entre mayúsculas y minúsculas en nombres de archivos.

---

## 22. URL PÚBLICA

Al completar el despliegue exitosamente, Vercel asigna automáticamente una dirección web accesible desde cualquier navegador en el mundo.

Es importante diferenciar las dos URLs del ciclo de vida del software:

* **URL de Desarrollo Local:**
  `http://localhost:3000` (Solo accesible localmente en la máquina de desarrollo).
* **URL Pública de Producción en Vercel:**
  `https://nombre-del-proyecto.vercel.app` (Accesible globalmente a través de Internet con cifrado SSL/HTTPS).

---

## 23. DEPLOYMENTS AUTOMÁTICOS

Una de las características más potentes de la plataforma Vercel es la automatización del ciclo de despliegue mediante la integración continua con GitHub:

```text
Cambio de código local
   ↓
git commit -m "Actualización de componente"
   ↓
git push origin main
   ↓
GitHub recibe los cambios
   ↓
Vercel detecta la actualización (Webhook)
   ↓
Inicia nuevo Build y Deployment automático
```

Cada vez que el equipo de desarrollo envía una actualización al repositorio, Vercel recompila la aplicación y reemplaza la versión anterior en cuestión de segundos, sin tiempos de inactividad para los usuarios.

---

## 24. MAIN Y PRODUCCIÓN

En la gestión de repositorios con Git, la rama principal (habitualmente denominada `main` o `master`) representa el código oficial y estable del proyecto.

Vercel vincula por defecto la rama `main` al **Entorno de Producción** (*Production Environment*). Cualquier envío de código (`push`) o fusión de código (*merge*) hacia la rama `main` actualizará automáticamente el sitio web en la URL pública principal.

---

## 25. PREVIEW DEPLOYMENTS

Cuando se trabaja en ramas de desarrollo secundarias (por ejemplo `feature/nuevo-mapa`) o se crea una solicitud de extracción (*Pull Request*), Vercel genera automáticamente un **Preview Deployment** (Despliegue de Vista Previa).

* **Propósito:** Permite probar y visualizar los nuevos cambios en una URL pública temporal (única para esa rama) antes de combinarlos con la rama principal de producción.
* **Beneficio:** Facilita la revisión de calidad (*QA*) y la validación de nuevas características sin poner en riesgo la estabilidad del sitio oficial.

---

## 26. NEXT.CONFIG.TS

Al inspeccionar el archivo de configuración [next.config.ts](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/next.config.ts) de la aplicación `my-app`, se observa la siguiente estructura:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'gexfcndaymqdnuobjxnb.supabase.co',
      },
    ],
  },
};

export default nextConfig;
```

Esta configuración es directamente relevante para el despliegue en Vercel, ya que el componente `<Image />` de Next.js aplica optimizaciones estrictas de seguridad e imágenes en producción.

---

## 27. IMÁGENES EXTERNAS

Next.js requiere autorizar explícitamente cualquier dominio externo desde el cual la aplicación pretenda cargar imágenes mediante el componente optimizado `next/image`.

En nuestro archivo [next.config.ts](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/next.config.ts), se han configurado los siguientes patrones remotos (`remotePatterns`):

1. **`images.unsplash.com`:** Permite cargar fotografías de prueba y de stock de alta calidad.
2. **`placehold.co`:** Permite renderizar imágenes de marcadores de posición (*placeholders*) para eventos o tarjetas sin imagen asignada.
3. **`gexfcndaymqdnuobjxnb.supabase.co`:** Permite la carga directa de archivos e imágenes almacenados en las cestas de almacenamiento (*buckets*) del proyecto de Supabase del sistema.

Sin esta configuración explícita en `next.config.ts`, la aplicación desplegada en Vercel arrojaría un error de servidor (código 500) al intentar optimizar e imprimir imágenes provenientes de Supabase o Unsplash.

---

## 28. `.GITIGNORE`

El archivo [.gitignore](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/.gitignore) cumple una función de seguridad e higiene fundamental antes y durante el despliegue.

En el proyecto `my-app`, el archivo [.gitignore](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/.gitignore) incluye de forma explícita:

```text
/node_modules
/.next/
.env*
.vercel
```

**Razones técnicas de exclusión:**
* **`.env.local` / `.env*`:** Protege las credenciales y llaves secretas para evitar que sean expuestas públicamente en GitHub.
* **`node_modules`:** Evita subir gigabytes de archivos de dependencias que Vercel puede instalar automáticamente en la nube.
* **`.next`:** Excluye carpetas de compilación local temporales.
* **`.vercel`:** Excluye credenciales y configuraciones de vinculación local de la herramienta de línea de comandos de Vercel.

---

## 29. `.VERCEL`

La carpeta `.vercel` es generada localmente cuando un desarrollador utiliza la herramienta de comandos Vercel CLI (`vercel link`) para vincular su entorno de trabajo local con el proyecto en la nube.

Contiene archivos JSON con los identificadores del proyecto (`projectId`) y de la organización (`orgId`). Esta carpeta se encuentra adecuadamente ignorada en [.gitignore](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/.gitignore) debido a que es específica de la computadora del desarrollador y no debe ser compartida en el repositorio común.

---

## 30. ERROR: LA PÁGINA FUNCIONA LOCALMENTE PERO NO EN VERCEL

Un escenario frecuente en proyectos web es que la aplicación funcione correctamente en `http://localhost:3000` pero falle o presente errores al desplegarse en Vercel.

Las causas más habituales de este comportamiento son:

1. **Variables de entorno omitidas:** Olvidar configurar en Vercel las variables declaradas en el `.env.local` local.
2. **Diferencias de sistema operativo (Sensibilidad a mayúsculas/minúsculas):** Windows no distingue entre `Componente.tsx` y `componente.tsx`, pero los servidores Linux de Vercel sí. Un import con mayúscula incorrecta fallará en producción.
3. **Falta de dependencias en `package.json`:** Librerías instaladas globalmente en la máquina del desarrollador pero no guardadas en el archivo de dependencias del proyecto.
4. **Errores de validación de tipos TypeScript:** Omitir errores de tipos que en desarrollo se ignoran pero que en `npm run build` detienen la compilación.
5. **Dominios de imágenes no autorizados:** Intentar cargar imágenes externas no registradas en `next.config.ts`.

---

## 31. ERROR DE VARIABLES DE ENTORNO

**Caso típico:**
El desarrollador prueba la plataforma en su computadora; la conexión con Supabase funciona perfectamente porque el archivo `.env.local` contiene la URL y la Anon Key.

Al publicar en Vercel, si no se registraron manualmente las variables en la sección *Environment Variables* del proyecto remoto, la aplicación en la nube intentará ejecutar la línea:
`process.env.NEXT_PUBLIC_SUPABASE_URL` obteniendo el valor `undefined`.

**Resultado:**
Las peticiones a la base de datos fallan y la interfaz pública no muestra eventos ni datos.

**Solución conceptual:**
Ingresar al panel de Vercel en **Settings → Environment Variables**, añadir `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` con sus valores correspondientes y redeplegar el proyecto.

---

## 32. CAMBIOS EN VARIABLES DE ENTORNO

Cuando se añade, edita o elimina una variable de entorno en el panel de control de Vercel, los cambios **no se aplican instantáneamente al sitio que ya está publicado**.

Dado que Next.js incrusta las variables que inician con `NEXT_PUBLIC_` durante la fase de compilación (*build time*), es **estrictamente necesario realizar un nuevo despliegue** (*Redeploy*) para que la compilación tome los nuevos valores de las variables.

---

## 33. ERROR DE BUILD

Cuando un despliegue falla en la fase de compilación, el flujo de diagnóstico metódico a seguir es el siguiente:

1. **Notificación de fallo:** Vercel marca el estado del despliegue con un ícono rojo (*Failed*).
2. **Abrir registros:** Hacer clic en el despliegue fallido y seleccionar la pestaña **Build Logs**.
3. **Identificar la causa raíz:** Analizar las últimas líneas del registro para ubicar el archivo, línea exacta y mensaje de error (por ejemplo: `Type error: Property 'id' does not exist on type...`).
4. **Reproducir localmente:** En la computadora de desarrollo, ejecutar `npm run build` para reproducir el fallo.
5. **Corregir el código:** Editar el archivo afectado y validar con un nuevo `npm run build` local.
6. **Publicar solución:** Ejecutar `git commit` y `git push` a GitHub para desencadenar el nuevo despliegue exitoso.

---

## 34. DIFERENCIA ENTRE PUSH Y DEPLOYMENT

Es fundamental distinguir conceptualmente entre la acción del control de versiones y la acción del hosting:

* **`git push`:** Es la acción de enviar commits y transferir el código fuente modificado desde la máquina local hacia el almacenamiento del repositorio en GitHub. No significa necesariamente que el sitio esté publicado o funcionado.
* **`deployment`:** Es el proceso integral donde un servidor remoto (Vercel) toma el código fuente de GitHub, instala librerías, compila los archivos, ejecuta pruebas, construye la aplicación y la publica en una infraestructura pública accesible por Internet.

---

## 35. FLUJO COMPLETO DEL PROYECTO

El flujo de arquitectura de extremo a extremo que conecta todas las herramientas de la plataforma documentada en esta tesis se representa a continuación:

```text
ANTIGRAVITY / EDITOR DE CÓDIGO
       ↓
Desarrollo y edición de código fuente (my-app)
       ↓
GIT (Control de versiones local)
       ↓
GITHUB (Repositorio central en la nube)
       ↓
VERCEL (Servidor de compilación y hosting)
       ↓
NEXT.JS EN PRODUCCIÓN (Renderizado e interfaz)
       ↓
SUPABASE (Base de datos PostgreSQL e imágenes)
       ↓
USUARIO FINAL (Acceso web mediante URL pública)
```

---

## 36. ACTUALIZAR LA APLICACIÓN

Para realizar futuras actualizaciones o correcciones a la plataforma ya desplegada, se debe seguir el procedimiento estandarizado de trabajo:

1. Modificar o agregar las funciones necesarias dentro del código de `my-app`.
2. Probar el funcionamiento correcto localmente mediante `npm run dev`.
3. Comprobar que no existan errores de compilación ejecutando `npm run build`.
4. Revisar los archivos modificados con `git status`.
5. Seleccionar las modificaciones con `git add .`.
6. Registrar el avance con un mensaje descriptivo mediante `git commit -m "Descripción de la mejora"`.
7. Enviar los cambios a la nube mediante `git push origin main`.
8. Monitorear en el panel de Vercel cómo se genera automáticamente el nuevo despliegue.
9. Verificar la URL pública para confirmar la actualización en producción.

---

## 37. ROL DE CADA SERVICIO

La siguiente tabla resume la responsabilidad técnica de cada una de las herramientas utilizadas en la construcción y despliegue de la plataforma:

| Herramienta | Función en el Proyecto |
| :--- | :--- |
| **Antigravity / Editor** | Entorno de desarrollo integrado donde se escribe el código TypeScript y React. |
| **Node.js / npm** | Entorno de ejecución local y gestor de paquetes de librerías de software. |
| **Git** | Sistema de control de versiones para registrar el historial de cambios del código. |
| **GitHub** | Plataforma de almacenamiento remoto y colaborativo del repositorio del proyecto. |
| **Vercel** | Plataforma de automatización de build, hosting cloud y distribución global por CDN. |
| **Supabase** | Backend de servicios (base de datos PostgreSQL, autenticación y almacenamiento). |
| **Next.js 16** | Framework de React para el desarrollo de la aplicación web de alto rendimiento. |

---

## 38. CHECKLIST ANTES DE PUBLICAR

Antes de realizar el lanzamiento oficial o despliegue definitivo a producción, se debe verificar el cumplimiento de los siguientes puntos:

* [ ] La aplicación ejecuta correctamente en desarrollo mediante `npm run dev`.
* [ ] Se ejecutó y verificó la compilación local con `npm run build` sin errores de TypeScript o sintaxis.
* [ ] Se revisó el estado del repositorio local con `git status`.
* [ ] Se confirmó que el archivo [.gitignore](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/.gitignore) excluye credenciales, `.env.local` y carpetas compiladas.
* [ ] Se identificaron los nombres exactos de las variables de entorno necesarias.
* [ ] El repositorio remoto en GitHub cuenta con el código más reciente subido.
* [ ] Se ingresaron las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en el panel de Vercel.
* [ ] El proceso de *Build* en Vercel finaliza con estado exitoso (*Success*).
* [ ] Se probó la navegación y funcionalidad en la URL pública entregada por Vercel.
* [ ] Se comprobó la carga de datos de eventos e imágenes conectadas con Supabase en el sitio desplegado.

---

## 39. ARCHIVOS RELACIONADOS

Los archivos clave dentro de la estructura de [my-app](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app) que intervienen directamente en el proceso de despliegue son:

| Archivo | Relación con el Despliegue |
| :--- | :--- |
| **[package.json](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json)** | Declara scripts de compilación (`build`) y dependencias del proyecto (`next`, `react`, `@supabase/supabase-js`). |
| **`package-lock.json`** | Garantiza que Vercel instale las versiones exactas de las librerías utilizadas en desarrollo. |
| **[next.config.ts](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/next.config.ts)** | Configura los dominios autorizados (`remotePatterns`) para la optimización de imágenes externas (Supabase, Unsplash). |
| **[.gitignore](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/.gitignore)** | Protege el proyecto evitando subir secretos (`.env.local`), dependencias (`node_modules`) y carpetas temporales. |
| **[`src/lib/supabase.ts`](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/lib/supabase.ts)** | Inicializa la comunicación con Supabase leyendo las variables de entorno provistas por Vercel. |

---

## 40. ESTADO ACTUAL

Para mantener la precisión documental del proyecto de tesis, se realiza una clara distinción entre lo verificado en la estructura local y los elementos que requieren comprobación en la consola remota:

### Confirmado desde el repositorio local (`my-app`)
* La estructura del proyecto utiliza **Next.js 16.2.4** con **React 19** y **TypeScript**.
* Los scripts de compilación estándar (`build: "next build"`) están definidos en [package.json](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/package.json).
* El archivo [.gitignore](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/.gitignore) incluye la protección de `.env*`, `.next`, `node_modules` y `.vercel`.
* El archivo [next.config.ts](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/next.config.ts) autoriza las imágenes provenientes del subdominio de Supabase (`gexfcndaymqdnuobjxnb.supabase.co`).
* El cliente de datos en [`src/lib/supabase.ts`](file:///C:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/src/lib/supabase.ts) utiliza las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Configuración que debe verificarse directamente en Vercel
Dado que la plataforma de Vercel opera de forma remota en la nube, los siguientes puntos deben ser confirmados revisando directamente la consola web de Vercel:

* [ ] Nombre del proyecto registrado en Vercel y dominio asignado (`.vercel.app`).
* [ ] Confirmación de la carga de las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el apartado *Environment Variables*.
* [ ] Verificación de la rama configurada para despliegue de producción (`main`).
* [ ] Historial de deployments recientes y estado de salud del último Build.
* [ ] Configuración del *Root Directory* si el proyecto estuviera dentro de una subcarpeta en el repositorio Git.

---

## 41. AYUDA MEMORIA

## Ayuda memoria

* **Localhost** → aplicación ejecutándose únicamente en mi computadora.
* **GitHub** → plataforma que guarda y gestiona el código fuente.
* **Vercel** → plataforma que publica la aplicación en Internet.
* **Build** → proceso de compilación que prepara la aplicación para producción.
* **Deployment** → versión publicada de la aplicación en la nube.
* **Environment Variables** → configuración y llaves secretas que la aplicación requiere.
* **`npm run dev`** → comando para trabajar en entorno de desarrollo.
* **`npm run build`** → comando para verificar la compilación de producción.
* **`git push`** → sube los cambios de código a GitHub.
* **Vercel** → detecta el push en GitHub y genera el nuevo deployment.

---

## 42. PREGUNTAS PARA DEFENSA

## Preguntas que debería poder responder

* **¿Qué es un deployment?**
  *Es el proceso de compilar, alojar y publicar una aplicación de software en un servidor o plataforma remota para hacerla accesible a los usuarios mediante Internet.*

* **¿Qué diferencia existe entre localhost y producción?**
  *Localhost es el entorno de desarrollo privado accesible solo desde la propia máquina del desarrollador; producción es el entorno publicado en la nube, optimizado, seguro y disponible globalmente.*

* **¿Por qué utilizan Vercel?**
  *Porque es la plataforma nativa para Next.js que automatiza la compilación, gestión de dominios HTTPS, variables de entorno y despliegues continuos integrados con GitHub.*

* **¿Qué relación tiene Vercel con GitHub?**
  *Vercel se conecta a GitHub como fuente de código. Al recibir notificaciones de nuevos cambios (`push`), Vercel descarga el código y ejecuta automáticamente el despliegue.*

* **¿Qué sucede después de un push?**
  *Vercel detecta la actualización en el repositorio, descarga el código nuevo, ejecuta `npm install` y `npm run build`, y sustituye la versión publicada por la nueva sin interrupción del servicio.*

* **¿Por qué no se sube `node_modules`?**
  *Porque es una carpeta sumamente pesada con archivos específicos del sistema operativo local. Vercel la instala de forma limpia en la nube leyendo `package.json` y `package-lock.json`.*

* **¿Por qué `.env.local` no está en GitHub?**
  *Porque contiene credenciales y configuraciones sensibles que no deben exponerse públicamente. Está ignorado por `.gitignore` y sus variables se cargan de forma segura directamente en el panel de Vercel.*

* **¿Cómo obtiene Vercel las variables de Supabase?**
  *Mediante el menú Settings → Environment Variables en la interfaz de Vercel, inyectando las llaves durante el proceso de compilación a la aplicación Next.js.*

* **¿Qué es un build?**
  *Es el proceso de transformación donde el código fuente (TypeScript, JSX, CSS) se valida, compila y optimiza en paquetes estáticos y funciones de servidor listas para producción.*

* **¿Cómo se diagnostica un deployment fallido?**
  *Accediendo a la pestaña Build Logs en el panel de Vercel, identificando la línea exacta del error (TypeScript, sintaxis o variables faltantes) y reproduciendo el comando `npm run build` localmente para corregirlo.*

* **¿Qué diferencia hay entre GitHub y Vercel?**
  *GitHub es el repositorio donde se almacena y controla la versión del código fuente; Vercel es el servidor/hosting donde ese código se compila y ejecuta para los usuarios.*

---

## 43. RESULTADO ESPERADO

Al finalizar la lectura y aplicación de este capítulo, cualquier lector o evaluador del proyecto comprenderá claramente:

1. El recorrido completo que realiza el código desde la computadora de desarrollo hasta su publicación en Internet.
2. La responsabilidad precisa que asume GitHub como centro de control de versiones.
3. La responsabilidad de Vercel como motor de compilación, hosting y distribución.
4. El significado técnico de los procesos de *Build* y *Deployment*.
5. El procedimiento para gestionar de forma segura las variables de entorno necesarias.
6. La manera en que la versión desplegada en producción mantiene la comunicación con el backend de Supabase.
7. El ciclo de actualización continua de la plataforma ante futuros desarrollos.
