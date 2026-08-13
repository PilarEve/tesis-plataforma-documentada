# Capítulo 02: Preparación del Entorno de Desarrollo

Este documento constituye la guía paso a paso para preparar la computadora local antes de crear, ejecutar o modificar el proyecto. Está diseñado para una persona que comienza desde cero, explicando detalladamente los conceptos fundamentales, las herramientas requeridas y la verificación previa del entorno de trabajo.

---

## 1. Objetivo del capítulo

El objetivo de este capítulo es preparar el entorno informático básico para el desarrollo del proyecto.

Antes de construir una aplicación web o ejecutar código fuente, es necesario contar con un conjunto de herramientas esenciales instaladas y configuradas en el equipo informático. Al finalizar este capítulo, cualquier persona comprenderá qué herramientas necesita, para qué sirve cada una, cómo verificar su correcta instalación y cómo interactuar con el sistema a través de la terminal de comandos.

En este capítulo **únicamente acondicionaremos la computadora**. Todavía no crearemos ni ejecutaremos el proyecto en Next.js, lo cual se abordará detalladamente en el siguiente capítulo.

---

## 2. Conceptos básicos antes de comenzar

Para trabajar en el desarrollo de software, es fundamental familiarizarse con ciertos términos de uso cotidiano:

- **Entorno de desarrollo**: Es el conjunto de herramientas, programas y configuraciones que un desarrollador utiliza en su computadora para escribir, probar, depurar y administrar el código fuente de un proyecto de software.
- **Terminal de comandos**: Es una interfaz textual (pantalla de texto) que permite enviar instrucciones directamente al sistema operativo escribiendo líneas de texto en lugar de hacer clic en botones e íconos.
- **PowerShell**: Es la terminal moderna predeterminada en sistemas operativos Microsoft Windows. Permite ejecutar comandos administrativos y tareas de desarrollo de software.
- **Línea de comandos**: Es la instrucción o texto específico que escribe el usuario en la terminal antes de presionar la tecla `Enter` para su ejecución.
- **Ejecutar un comando**: Significa enviar una instrucción a la computadora para que lleve a cabo una acción concreta (por ejemplo, mostrar una versión, navegar a una carpeta o iniciar un programa).
- **Diferencia entre aplicación gráfica y herramienta de terminal**:
  - *Aplicación gráfica (GUI)*: Cuenta con ventanas, botones, menús transitables con el ratón o mouse (ejemplos: un navegador web, un reproductor de música o un visor de imágenes).
  - *Herramienta de terminal (CLI)*: Funciona únicamente mediante entradas e impresiones de texto sin componentes visuales interactivos tradicionales.

---

## 3. Visual Studio Code / Antigravity

### ¿Para qué se utiliza un editor de código?

Un **editor de código** es una aplicación especializada diseñada para escribir y modificar texto plano estructurado (código fuente de programación). A diferencia de un procesador de textos convencional (como Microsoft Word), un editor de código no aplica formatos de texto enriquecido (cursivas, márgenes de hoja o tipos de fuentes estilizadas), sino que ofrece resaltado de sintaxis, numeración de líneas y detección de errores de código.

### Uso en el proyecto

Durante el desarrollo de este proyecto se utiliza un entorno basado en **Visual Studio Code / Antigravity** para:

1. **Visualizar archivos**: Explorar la estructura de carpetas e inspeccionar el contenido del proyecto.
2. **Editar código**: Escribir y modificar archivos en lenguajes como TypeScript, React o CSS.
3. **Utilizar la terminal integrada**: Ejecutar comandos directamente dentro de la interfaz del editor sin necesidad de abrir ventanas externas.
4. **Trabajar con Git**: Gestionar los cambios de versión del proyecto.
5. **Utilizar asistencia de inteligencia artificial**: Contar con soporte interactivo para el análisis, generación e inspección de código durante el desarrollo.

### Diferencias fundamentales entre componentes

Es importante distinguir claramente el rol de cada herramienta en el trabajo diario:

- **Editor de código**: Es el espacio donde leemos y escribimos el código fuente.
- **Terminal**: Es el medio interactivo donde enviamos órdenes y ejecutamos procesos de desarrollo.
- **Navegador web**: Es el programa donde visualizamos y probamos el resultado final de la aplicación web en funcionamiento.

---

## 4. Node.js

### Conceptos fundamentales de Node.js

- **¿Qué es Node.js?**: Es un entorno de ejecución (*runtime*) de JavaScript orientado a servidores y computadoras locales. Tradicionalmente, JavaScript solo podía ejecutarse dentro de un navegador web; Node.js permite ejecutar programas escritos en JavaScript directamente en el sistema operativo.
- **¿Por qué es necesario para este proyecto?**: El proyecto está construido sobre Next.js y React. Node.js provee el motor necesario para procesar el código, compilar TypeScript, gestionar los paquetes de software y mantener en ejecución el servidor web local.
- **Relación con Next.js**: Next.js es un marco de trabajo (*framework*) basado en React que requiere obligatoriamente que Node.js esté instalado en el equipo para poder funcionar y servir páginas web.
- **¿Qué ocurre cuando instalamos Node.js?**: Al instalar Node.js, la computadora obtiene el intérprete de JavaScript del sistema y, de manera simultánea, el administrador de paquetes `npm`.
- **¿Qué es una versión LTS?**: Significa *Long Term Support* (Soporte a Largo Plazo). Es una versión de Node.js madura, estable y recomendada para la gran mayoría de los usuarios y desarrollos de producción.

### Comprobación de la instalación

Para verificar si Node.js está instalado correctamente en la computadora:

1. Abre la terminal de comandos (PowerShell).
2. Escribe el siguiente comando y presiona `Enter`:

```bash
node --version
```

- **¿Qué hace el comando?**: Le solicita al intérprete de Node.js que reporte en pantalla el número de versión instalado en el sistema.
- **Resultado esperado**: La terminal responderá mostrando la versión instalada, por ejemplo:

```bash
v20.18.0
```

*(Nota: El número exacto de versión puede variar según la instalación realizada, pero debe comenzar con una letra `v` seguida de números).*

---

## 5. npm

### Conceptos fundamentales de npm

- **¿Qué es npm?**: Significa *Node Package Manager* (Administrador de Paquetes de Node). Es el gestor de dependencias estándar que se instala automáticamente junto a Node.js.
- **¿Para qué sirve?**: Permite descargar, instalar, actualizar y eliminar librerías externas o módulos de código reutilizables creados por la comunidad de software.
- **Relación entre Node.js y npm**: Node.js es el motor que ejecuta el código, mientras que npm es la herramienta que organiza y descarga los paquetes de código que el proyecto necesita.
- **¿Qué son las dependencias?**: Son librerías externas que nuestro proyecto utiliza para resolver tareas específicas sin necesidad de escribirlas desde cero (por ejemplo: la librería para renderizar el mapa interactivo o para manipular fechas).
- **¿Qué significa instalar una dependencia?**: Significa descargar el paquete de código desde el registro oficial de npm e incorporarlo en la carpeta de nuestro proyecto.

### Comprobación de la instalación

Para comprobar la presencia y versión de npm:

1. En la terminal de comandos, escribe:

```bash
npm --version
```

- **¿Qué hace el comando?**: Consulta la versión activa de la herramienta npm.
- **Resultado esperado**: La terminal devolverá una respuesta numérica que indica la versión del administrador de paquetes, por ejemplo:

```bash
10.8.2
```

---

## 6. npx

### Conceptos fundamentales de npx

- **¿Qué es npx?**: Significa *Node Package Execute* (Ejecutor de Paquetes de Node). Es una utilidad complementaria que se incluye junto con npm a partir de sus versiones modernas.
- **Diferencia básica entre npm y npx**:
  - `npm` se utiliza para **instalar y gestionar** paquetes y librerías dentro del proyecto.
  - `npx` se utiliza para **ejecutar herramientas o comandos de forma directa** sin necesidad de instalarlos globalmente o de forma permanente en la computadora.
- **Uso posterior en Next.js**: En el siguiente capítulo utilizaremos `npx` para ejecutar el asistente oficial de creación de proyectos de Next.js (`create-next-app`) de forma limpia e inmediata.

### Comprobación de la herramienta

Para confirmar que npx está disponible en el sistema:

1. Ejecuta el comando:

```bash
npx --version
```

- **¿Qué hace el comando?**: Muestra en pantalla el número de versión de la herramienta npx.
- **Resultado esperado**: La terminal mostrará un resultado numérico correspondiente a la versión, por ejemplo:

```bash
10.8.2
```

*(No crearemos el proyecto en esta etapa; únicamente confirmamos la respuesta de la terminal).*

---

## 7. Git

### Conceptos fundamentales de Git

- **¿Qué es Git?**: Es un sistema de **control de versiones distribuido** diseñado para rastrear cambios en el código fuente de un proyecto a lo largo del tiempo.
- **¿Qué problema resuelve?**: Evita tener que crear carpetas duplicadas manualmente (como `proyecto_final`, `proyecto_v2`, `proyecto_definitivo`) y permite volver a cualquier estado anterior del código si se comete un error.
- **¿Qué es control de versiones?**: Es el mecanismo que guarda un historial cronológico detallado de quién modificó qué archivo, cuándo lo hizo y por qué.
- **¿Qué es un repositorio?**: Es la carpeta o estructura de datos donde Git almacena el historial completo de versiones de un proyecto.
- **¿Qué es un commit?**: Es una captura o guardarropas puntual del estado del código en un momento específico, acompañado de un mensaje explicativo.
- **¿Qué es una rama (*branch*)**: Es una línea alternativa e independiente de desarrollo que permite probar nuevas funciones sin alterar la versión principal de trabajo.
- **Trabajar localmente**: Significa que todas las operaciones y registros de Git ocurren directamente en el disco duro de la computadora del desarrollador, sin depender obligatoriamente de una conexión a Internet.

### Comprobación de la instalación

Para comprobar la instalación de Git:

1. En la terminal de comandos, escribe:

```bash
git --version
```

- **¿Qué hace el comando?**: Consulta al sistema si el programa Git está reconocido e instalado en el sistema operativo.
- **Resultado esperado**: La terminal devolverá el nombre del programa y su número de versión, por ejemplo:

```bash
git version 2.45.2.windows.1
```

---

## 8. GitHub

### Diferencia esencial entre Git y GitHub

Es fundamental no confundir ambas tecnologías:

- **Git**: Es la herramienta de software de control de versiones instalada localmente en la computadora.
- **GitHub**: Es una plataforma basada en la nube (sitio web) que permite almacenar, respaldar y compartir los repositorios de Git a través de Internet.

```
┌──────────────────────────────────────┐       Sincronización       ┌──────────────────────────────────────┐
│             Computadora              │ <────────────────────────> │                GitHub                │
│ (Git: Control de versiones local)    │        (Internet)          │ (Plataforma web de respaldo remoto)  │
└──────────────────────────────────────┘                            └──────────────────────────────────────┘
```

### Utilidad de GitHub en este proyecto

En el marco de este proyecto de tesis, GitHub cumple las siguientes funciones:

1. **Respaldo seguro**: Mantiene una copia de seguridad en la nube de todo el desarrollo del software.
2. **Historial accesible**: Permite revisar la evolución del proyecto desde cualquier equipo.
3. **Integración con servicios de despliegue**: Facilita la vinculación automática con plataformas como Vercel para publicar la aplicación web en producción.

*(No se requiere ejecutar comandos avanzados ni gestionar ramas remotas en este capítulo preliminar).*

---

## 9. PowerShell

En el entorno de desarrollo utilizado (Windows), la terminal predeterminada para ejecutar comandos es **PowerShell**.

### ¿Cómo abrir PowerShell en Windows?

1. Presiona la tecla `Windows` en el teclado.
2. Escribe `PowerShell`.
3. Haz clic en la aplicación **Windows PowerShell**.

Alternativamente, dentro del editor de código (VS Code / Antigravity), puedes abrir la terminal integrada desde el menú superior en **Terminal -> Nueva terminal** (o presionando `Ctrl + Shift + ~`).

### Estructura de la ruta de PowerShell

Cuando abres PowerShell, verás en pantalla una línea similar a la siguiente:

```powershell
PS C:\Users\Usuario\Documents\Proyecto>
```

Desglose de cada parte de la ruta:

- **`PS`**: Indica que el entorno activo de la terminal es PowerShell.
- **`C:`**: Representa la unidad de disco duro principal del sistema informático.
- **`\Users\Usuario\`**: Especifica la carpeta personal del usuario activo en Windows.
- **`\Documents\Proyecto\`**: Corresponde a la estructura de subcarpetas donde está ubicado el usuario actualmente.
- **`>`**: Es el delimitador visual (*prompt*). Todo comando debe escribirse a la derecha de este símbolo.

---

## 10. Comandos básicos para navegar por carpetas

Para trabajar eficientemente en la terminal, es imprescindible saber consultar la ubicación actual y desplazarse entre carpetas mediante comandos de texto:

### 1. `pwd` (Print Working Directory)

- **Comando**:
  ```powershell
  pwd
  ```
- **¿Qué hace?**: Muestra la ruta completa de la carpeta en la que te encuentras posicionado actualmente.
- **Resultado esperado**:
  ```powershell
  Path
  ----
  C:\Users\Usuario\Documents
  ```

### 2. `dir` (Directory Listing)

- **Comando**:
  ```powershell
  dir
  ```
- **¿Qué hace?**: Lista todos los archivos y subcarpetas contenidos dentro de la carpeta actual.
- **Resultado esperado**: Una lista con el tipo de elemento (`d----` para directorio/carpeta, `-a---` para archivo), fecha de modificación y nombre.

### 3. `cd nombre-carpeta` (Change Directory)

- **Comando**:
  ```powershell
  cd Tesis
  ```
- **¿Qué hace?**: Navega e ingresa a la subcarpeta especificada (en este ejemplo, la carpeta `Tesis`).
- **Resultado esperado**: La ruta del prompt de la terminal cambiará para incluir el nuevo directorio:
  ```powershell
  PS C:\Users\Usuario\Documents\Tesis>
  ```

### 4. `cd ..` (Change Directory Up)

- **Comando**:
  ```powershell
  cd ..
  ```
- **¿Qué hace?**: Retrocede un nivel hacia la carpeta contenedora superior (carpeta padre).
- **Resultado esperado**: Si estabas en `C:\Users\Usuario\Documents\Tesis`, al ejecutar el comando volverás a `C:\Users\Usuario\Documents`.

### Ejemplo de flujo de navegación gradual

Supongamos que deseas navegar desde tu carpeta personal hasta la carpeta del proyecto:

```
Documentos (Directorio base)
 └── Tesis (Carpeta del proyecto académico)
      └── my-app (Carpeta de la aplicación web)
```

Secuencia de comandos en la terminal:

```powershell
# 1. Comprobar la ubicación inicial
pwd

# 2. Navegar a la carpeta Tesis
cd Tesis

# 3. Navegar a la carpeta de la aplicación
cd my-app

# 4. Verificar que estamos en la carpeta correcta
pwd
```

---

## 11. Navegador web

Un **navegador web** (como Google Chrome, Mozilla Firefox o Microsoft Edge) es una herramienta indispensable durante la fase de desarrollo.

### Función del navegador en el desarrollo

1. **Visualización en tiempo real**: Renderiza y muestra la interfaz de usuario de la aplicación web en tiempo real a medida que se modifica el código.
2. **Inspección de código y consola**: Permite utilizar las Herramientas de Desarrollador del navegador (*DevTools*) para inspeccionar elementos visuales, medir tiempos de respuesta y leer mensajes de error o depuración.
3. **Acceso local**: Durante el desarrollo, la aplicación web no se publica de inmediato en Internet, sino que se ejecuta localmente en la computadora. Posteriormente, accederemos a la aplicación ingresando en la barra de direcciones del navegador una URL local como:

```text
http://localhost:3000
```

*(La explicación técnica completa del puerto local y `localhost` se desarrollará durante el capítulo de creación y primera ejecución de Next.js).*

---

## 12. Verificación completa del entorno

Antes de continuar con los siguientes capítulos, es fundamental realizar una verificación integral de que las herramientas básicas se encuentran correctamente instaladas en la computadora.

### Lista de comprobación rápida

Abre la terminal de comandos y ejecuta en secuencia las siguientes 4 órdenes:

| # | Comando a ejecutar | Resultado esperado | ¿Instalación correcta? |
| :-: | :--- | :--- | :-: |
| 1 | `node --version` | Muestra la versión de Node (ejemplo: `v20.x.x`) | [ ] |
| 2 | `npm --version` | Muestra la versión de npm (ejemplo: `10.x.x`) | [ ] |
| 3 | `npx --version` | Muestra la versión de npx (ejemplo: `10.x.x`) | [ ] |
| 4 | `git --version` | Muestra la versión de Git (ejemplo: `git version 2.x.x`) | [ ] |

Si los cuatro comandos responden devolviendo un número de versión válido, el entorno de desarrollo se encuentra listo.

### ¿Qué hacer si aparece un mensaje indicando que el comando "no se reconoce"?

Si al ejecutar alguno de los comandos anteriores la terminal muestra una advertencia como:

> *"El término 'node' no se reconoce como un comando interno o externo, programa o archivo por lote ejecutable."*

Normalmente se debe a una de las siguientes tres causas principales:

1. **La herramienta no está instalada**: Es necesario descargar el instalador oficial de la herramienta e instalarla en el equipo.
2. **No se agregó la ruta al PATH**: Al instalar programas en Windows, el instalador debe registrar la ruta del programa en una variable del sistema llamada `PATH`. Si esta casilla se desmarcó durante la instalación, Windows no sabrá dónde encontrar la herramienta cuando la solicites por su nombre.
3. **La terminal requiere reiniciar**: La terminal no detecta las herramientas recién instaladas hasta que se cierra por completo la ventana de PowerShell y se vuelve a abrir.

#### Breve explicación de la variable PATH

El **PATH** es una lista de carpetas internas que el sistema operativo consulta de manera automática cada vez que escribes el nombre de un comando en la terminal. Si la carpeta donde se instaló Node.js o Git no figura dentro de esa lista, la terminal informará que no reconoce la orden.

---

## 13. Herramientas que NO necesitamos instalar todavía

Para evitar confusiones y no saturar el equipo con configuraciones innecesarias en esta fase inicial, **aclaramos explícitamente que NO se debe instalar ni configurar aún**:

- **Supabase**: Base de datos relacional y almacenamiento remoto. Se configurará y vinculará a través de credenciales web en un capítulo específico.
- **Leaflet**: Librería de mapas interactivos. Se agregará como dependencia dentro del proyecto más adelante mediante `npm`.
- **Vercel**: Plataforma de despliegue en la nube. Se enlazará al finalizar el desarrollo.
- **Librerías de interfaz gráfica o iconos**: Se instalarán dentro de la carpeta del proyecto cuando este ya se encuentre inicializado.
- **Scripts de Web Scraping o servicios de Inteligencia Artificial**: Se abordarán en los capítulos avanzados correspondientes.

---

## 14. Resultado esperado

Al finalizar satisfactoriamente este capítulo, la computadora debe contar como mínimo con los siguientes componentes preparados:

- [x] **Editor de código**: VS Code o un entorno equivalente instalado.
- [x] **Terminal**: Windows PowerShell o la terminal integrada del editor funcionando.
- [x] **Node.js**: Entorno de ejecución disponible y verificado con `node --version`.
- [x] **npm**: Administrador de paquetes operativo y verificado con `npm --version`.
- [x] **npx**: Ejecutor de paquetes disponible y verificado con `npx --version`.
- [x] **Git**: Sistema de control de versiones listo y verificado con `git --version`.
- [x] **Navegador web**: Navegador funcional para la inspección y prueba de la web.
- [x] **Cuenta de GitHub**: Registro o acceso preparado a la plataforma web para cuando corresponda sincronizar el proyecto.

*(Nota: En esta etapa no es obligatorio ni necesario tener creado el proyecto en Next.js).*

---

## 15. Errores frecuentes

A continuación se detallan los problemas más habituales al preparar el entorno y cómo resolverlos de manera directa:

### 1. `node` no se reconoce como un comando

- **Causa**: Node.js no fue instalado o la terminal se abrió antes de finalizar el instalador.
- **Solución**: Cierra la terminal de PowerShell, vuelve a abrirla e intenta nuevamente. Si el mensaje persiste, descarga e instala la versión LTS desde el sitio oficial de Node.js asegurándote de marcar la opción *"Add to PATH"*.

### 2. `npm` no se reconoce como un comando

- **Causa**: La instalación de Node.js quedó incompleta o corrupta.
- **Solución**: Reinstala Node.js utilizando el instalador ejecutable oficial, el cual incluye automáticamente a `npm` y a `npx`.

### 3. `git` no se reconoce como un comando

- **Causa**: Git no está instalado o no se seleccionaron los valores predeterminados durante la instalación.
- **Solución**: Descarga e instala Git para Windows desde su sitio web oficial y reinicia la terminal.

### 4. Estoy ejecutando comandos en una carpeta incorrecta

- **Causa**: La terminal se encuentra posicionada en un directorio distinto al deseado (por ejemplo, en la carpeta raíz del disco en lugar de la carpeta de documentos).
- **Solución**: Ejecuta el comando `pwd` para saber dónde estás ubicado exactamente y utiliza el comando `dir` para listar las carpetas disponibles antes de navegar con `cd`.

---

## 16. Ayuda memoria

### Resumen conceptual rápido

- **Editor de código**: Aplicación para escribir y revisar el código fuente del proyecto.
- **PowerShell**: Terminal de texto para ejecutar comandos en sistemas Windows.
- **Node.js**: Entorno que ejecuta JavaScript fuera del navegador y permite correr el servidor de desarrollo.
- **npm**: Administrador que instala y organiza las dependencias y librerías externas del proyecto.
- **npx**: Utilidad que permite ejecutar herramientas y comandos de paquetes sin necesidad de instalarlos previamente.
- **Git**: Sistema local que controla las versiones e historial de cambios en los archivos.
- **GitHub**: Servicio en la nube para respaldar y compartir el repositorio de Git.
- **Navegador web**: Aplicación gráfica para visualizar y evaluar el funcionamiento del sistema web.

### Comandos fundamentales de verificación del entorno

```bash
# 1. Comprobar Node.js
node --version

# 2. Comprobar npm
npm --version

# 3. Comprobar npx
npx --version

# 4. Comprobar Git
git --version
```

### Comandos básicos de navegación en terminal

```powershell
# Consultar ruta actual
pwd

# Listar contenido de la carpeta actual
dir

# Entrar en una carpeta
cd nombre-carpeta

# Volver a la carpeta anterior
cd ..
```
