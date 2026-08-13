# Capítulo 05: Git y GitHub desde Cero

Este documento constituye una guía exhaustiva y progresiva sobre el uso de **Git** (sistema de control de versiones local) y **GitHub** (plataforma remota de alojamiento). Está diseñado para ser estudiado desde los conceptos más elementales hasta comprender en detalle el flujo de trabajo colaborativo utilizado en el desarrollo del proyecto de tesis.

---

## 1. ¿Qué problema resuelve Git?

Antes de la existencia de los sistemas de control de versiones, la gestión de cambios en proyectos informáticos solía realizarse duplicando carpetas manualmente en la computadora.

### El problema de las carpetas duplicadas

Era habitual encontrar directorios nombrados de la siguiente manera:

```text
proyecto-final/
proyecto-final-2/
proyecto-final-ahora-si/
proyecto-final-definitivo/
proyecto-final-definitivo-v2/
```

Este enfoque tradicional presenta serias deficiencias:
1. **Pérdida de control**: Es imposible saber exactamente qué líneas de código cambiaron entre una carpeta y otra.
2. **Riesgo de sobreescritura**: Al trabajar en equipo, una persona puede reemplazar por error el trabajo realizado por otra.
3. **Desperdicio de espacio**: Duplicar el proyecto entero consume espacio innecesario en disco.
4. **Dificultad de recuperación**: Volver a una versión funcional del pasado resulta confuso y propenso a errores.

### La solución con Git

Git elimina por completo la necesidad de copiar carpetas manualmente. Permite mantener **una sola carpeta de trabajo** mientras registra de forma transparente un historial cronológico, preciso y reversible de cada modificación realizada en el código.

---

## 2. ¿Qué es Git?

**Git** es un sistema de **control de versiones distribuido**, gratuito y de código abierto, diseñado para rastrear cambios en archivos de texto y código fuente a lo largo del tiempo.

### Conceptos clave

- **Sistema de control de versiones**: Herramienta que registra el historial de modificaciones en los archivos para poder consultar, comparar o restaurar cualquier estado anterior.
- **Historial de cambios**: Registro cronológico de todas las confirmaciones (*commits*) guardadas en el proyecto.
- **Repositorio**: Estructura de almacenamiento donde Git guarda todo el historial y metadatos de un proyecto.
- **Trabajo local**: Git opera de forma 100% autónoma en el disco duro de la computadora, sin requerir conexión a Internet para guardar versiones o consultar el historial.

---

## 3. ¿Qué es GitHub?

Es fundamental diferenciar claramente **Git** de **GitHub**:

- **Git**: Es el programa de software instalado en la computadora local que gestiona el control de versiones.
- **GitHub**: Es un servicio web en la nube que aloja repositorios de Git a través de Internet, facilitando el respaldo remoto, la colaboración en equipo y la integración con herramientas de despliegue continuo (como Vercel).

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPARATIVA GIT vs GITHUB                       │
├───────────────────────────────────┬────────────────────────────────────┤
│               Git                 │               GitHub               │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Herramienta de software local.  │ • Plataforma web en la nube.       │
│ • Funciona sin Internet.          │ • Requiere conexión a Internet.    │
│ • Gestiona archivos e historial. │ • Almacena y comparte repositorios.│
│ • Se utiliza desde la terminal.   │ • Interfaz web + servicios remotos.│
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 4. Repositorio local y repositorio remoto

En un flujo moderno de desarrollo, el trabajo se sincroniza de manera bidireccional entre la computadora local y la nube:

### Envio de cambios local ➔ remoto (Push)

```text
Computadora Local
      │
[ Repositorio Git ]  ────── git push ──────>  GitHub (Repositorio Remoto)
```

### Recepción de cambios remoto ➔ local (Pull)

```text
GitHub (Repositorio Remoto)  ────── git pull ──────>  Computadora Local
                                                            │
                                                   [ Repositorio Git ]
```

- **Repositorio Local**: Vive dentro de la subcarpeta oculta `.git` en la computadora del desarrollador.
- **Repositorio Remoto**: Vive en los servidores de GitHub (por ejemplo, bajo la URL `https://github.com/PilarEve/tesis-plataforma-documentada.git`).

---

## 5. Inicializar un repositorio (`git init`)

Para comenzar a rastrear un proyecto nuevo que aún no utiliza Git, se ejecuta en la terminal:

```bash
git init
```

### ¿Qué hace el comando?

1. Crea una carpeta oculta especial llamada **`.git/`** en la raíz del proyecto.
2. Inicializa las estructuras de datos y la base de datos interna donde Git registrará los cambios.

> [!WARNING]
> La carpeta `.git/` nunca debe modificarse ni eliminarse manualmente. Si eliminas la carpeta `.git/`, perderás todo el historial de versiones del proyecto. Tampoco debes ejecutar `git init` dentro de un proyecto que ya es un repositorio activo.

---

## 6. Verificar el estado (`git status`)

El comando más importante y utilizado en Git es:

```bash
git status
```

### ¿Qué hace el comando?

Muestra el estado actual del directorio de trabajo y del área de preparación (*staging area*).

### Estados principales reportados por `git status`

1. **`working tree clean`**: Significa que no hay modificaciones pendientes y que todo el código actual coincide exactamente con el último commit guardado.
2. **`Untracked files`** (Archivos no rastreados): Archivos nuevos recién creados que Git aún no ha comenzado a supervisar.
3. **`Changes not staged for commit`** (Archivos modificados): Archivos existentes en Git que han sufrido cambios pero aún no se han preparado para ser guardados.
4. **`Changes to be committed`** (Archivos preparados / Staged): Archivos cuyos cambios ya fueron marcados con `git add` y están listos para ser empaquetados en un commit.
5. **`On branch main`**: Indica cuál es la rama activa en la que estás trabajando.

---

## 7. Las tres etapas básicas de Git

Git organiza el flujo de guardado en tres zonas o estados claramente definidos:

```text
┌────────────────────────┐      git add      ┌────────────────────────┐
│  Directorio de Trabajo  ├──────────────────>│      Staging Area      │
│  (Archivos Modificados)│                   │   (Cambios Preparados) │
└────────────────────────┘                   └───────────┬────────────┘
                                                         │
                                                     git commit
                                                         │
                                                         ▼
┌────────────────────────┐      git push     ┌────────────────────────┐
│     GitHub Remoto      │<──────────────────┤    Historial Local     │
│   (Servidor en Nube)   │                   │ (Repositorio Git `.git`)│
└────────────────────────┘                   └────────────────────────┘
```

1. **Directorio de trabajo (*Working Directory*)**: Archivos reales en tu computadora donde editas código.
2. **Área de preparación (*Staging Area*)**: Zona intermedia donde seleccionas exactamente qué cambios formarán parte del próximo paquete de confirmación.
3. **Historial local (*Repository*)**: Base de datos de Git donde se registran permanentemente los commits confirmados.

---

## 8. Preparar cambios (`git add`)

El comando `git add` traslada cambios desde el directorio de trabajo hacia el área de preparación (*Staging Area*).

### Variantes comunes

- **`git add archivo.txt`**: Prepara únicamente el archivo especificado.
- **`git add docs/`**: Prepara todos los archivos modificados dentro de la carpeta `docs/`.
- **`git add .`**: Prepara **todos** los archivos modificados y no rastreados existentes en el directorio actual.

> [!TIP]
> Es una buena práctica ejecutar `git status` inmediatamente **antes** de ejecutar `git add .` para revisar qué archivos se están por agregar, evitando incluir accidentalmente archivos temporales o no deseados.

---

## 9. Crear una versión (`git commit`)

Un **commit** es un paquete cerrado de confirmación que guarda una captura instantánea (*snapshot*) del proyecto en un momento dado, firmado con fecha, autor y un mensaje explicativo.

### Comando de confirmación

```bash
git commit -m "docs: documentar preparacion del entorno"
```

### ¿Qué hace el comando?

Toma todos los archivos que se encontraban en el *Staging Area* y los graba permanentemente en el historial local de Git.

> [!NOTE]
> Hacer `git commit` guarda el cambio **únicamente en tu computadora local**. Los cambios no estarán visibles en GitHub hasta que ejecutes `git push`.

### Convenio de mensajes de commit

Para mantener un historial limpio y fácil de inspeccionar, en este proyecto se utilizan prefijos descriptivos estandarizados:

- **`docs:`**: Utilizado para cambios o adiciones en la documentación.
  - Ejemplo: `git commit -m "docs: documentar estructura del proyecto"`
- **`feat:`**: Utilizado para la creación de una nueva funcionalidad o módulo.
  - Ejemplo: `git commit -m "feat: agregar filtro por fecha en el mapa"`
- **`fix:`**: Utilizado para la corrección de errores de código (*bugs*).
  - Ejemplo: `git commit -m "fix: corregir carga de reportes en Supabase"`

---

## 10. Subir cambios a GitHub (`git push`)

El comando `git push` transmite los commits guardados en el repositorio local hacia el repositorio remoto alojado en GitHub.

### Comandos de envío

```bash
git push -u origin main
```

o simplemente:

```bash
git push
```

### Desglose explicativo de términos

- **`push`**: Envía y sube las confirmaciones locales a la nube.
- **`origin`**: Nombre alias predeterminado que hace referencia a la URL del repositorio remoto en GitHub.
- **`main`**: Nombre de la rama remota hacia la cual se enviarán los cambios.
- **`-u`** (o `--set-upstream`): Establece un enlace o vinculación permanente entre la rama local activa y la rama remota. Una vez configurado con `-u` la primera vez, en los siguientes envíos basta con escribir únicamente `git push`.

---

## 11. Descargar cambios de GitHub (`git pull`)

Cuando se trabaja en equipo o se modifica el repositorio desde otra computadora, el repositorio remoto en GitHub contendrá cambios que tu computadora local aún no posee.

### Comando de sincronización

```bash
git pull
```

### ¿Qué hace el comando?

Consulta el repositorio remoto (`origin`), descarga las nuevas confirmaciones que no existan en tu máquina local y las integra automáticamente en tu rama de trabajo actual.

---

## 12. Concepto de Ramas (*Branches*)

Una **rama** en Git representa una línea independiente de desarrollo. Permite modificar código, crear funcionalidades o escribir documentación en un espacio aislado sin alterar ni poner en riesgo la versión principal y estable del proyecto.

### Esquema conceptual de ramificación

```text
main (Rama estable de producción)
  │
  ├── dev (Rama de integración)
  │    │
  │    ├── dev-Evelyn (Trabajo individual)
  │    │
  │    └── dev-Venus (Trabajo individual)
```

En la etapa de desarrollo de este proyecto, se utilizaron ramas independientes (como `dev-Venus` o `dev-Evelyn`) para implementar componentes específicos del mapa y la base de datos sin afectar directamente la versión de producción.

---

## 13. Consultar ramas (`git branch`)

Para listar las ramas existentes en tu repositorio local:

```bash
git branch
```

### Resultado real obtenido en el proyecto

```text
  dev
  dev-Venus
* main
```

### Interpretación del asterisco (`*`)

El símbolo de asterisco **`*`** y el color destacado indican cuál es la **rama activa** en la que te encuentras posicionado actualmente. En este caso, el repositorio se encuentra ubicado en la rama `main`.

---

## 14. Cambiar de rama (`git switch`)

Para alternar y desplazarte entre ramas existentes:

```bash
git switch dev
```

- **¿Qué hace el comando?**: Cambia tu posición de trabajo a la rama `dev` y actualiza instantáneamente los archivos de tu carpeta para reflejar el estado del código en esa rama.

> [!NOTE]
> En documentación o guías antiguas de Git se utilizaba el comando `git checkout nombre-rama`. En las versiones modernas de Git se recomienda usar `git switch` como el comando principal y más claro para cambiar de rama.

---

## 15. Crear y cambiar a una nueva rama (`git switch -c`)

Si deseas crear una rama nueva e ingresarla inmediatamente en un solo paso:

```bash
git switch -c feature/reportes
```

- **`-c`** (Create): Le indica a Git que debe crear la rama `feature/reportes` a partir de la ubicación actual y posicionado sobre ella de inmediato.

---

## 16. El rol de la rama `main`

La rama **`main`** es la rama principal del repositorio. Representa el estado oficial, probado y estable del software. Todo código que se encuentre en `main` debe estar listo para ser desplegado en producción o presentado en evaluaciones.

---

## 17. Flujo colaborativo e histórico del desarrollo

Es importante distinguir entre la estrategia histórica empleada durante la construcción del proyecto y la estructura del repositorio documentado actual:

### Flujo histórico del desarrollo

Durante las fases iniciales de programación, se empleó un flujo ramificado de integración:

```text
[Desarrollador 1] ──> dev-Evelyn ──┐
                                   ├──> Pull Request ──> dev ──> main
[Desarrollador 2] ──> dev-Venus ───┘
```

1. **Trabajo individual**: Cada integrante avanzó en su respectiva rama de trabajo (`dev-Evelyn`, `dev-Venus`).
2. **Revisión y fusión**: Se enviaron las contribuciones mediante *Pull Requests* en GitHub para fusionarlas en la rama de desarrollo `dev` (como se comprueba en el commit real de fusión `Merge pull request #15 from PilarEve/dev-Venus`).
3. **Consolidación**: Una vez validado el funcionamiento global, el código se consolidó en la rama principal `main`.

### Flujo del repositorio documentado

Actualmente, el proyecto se gestiona directamente sobre la rama principal `main`, desde la cual se sincronizan las actualizaciones de la documentación del trabajo de tesis hacia el repositorio de GitHub.

---

## 18. Consultar el historial (`git log`)

Para revisar la secuencia cronológica de commits guardados en el repositorio:

```bash
git log --oneline -10
```

- **`git log`**: Muestra la lista completa de commits con autor, fecha, código hash y mensaje.
- **`--oneline`**: Muestra cada commit resumido en una sola línea.
- **`-10`**: Limita la salida a las últimas 10 confirmaciones.

### Ejemplo de historial real obtenido en este repositorio

```text
b5c3d65 docs: documentar estructura actual del proyecto
4ffee4d docs: documentar creacion del proyecto Next.js
78b2150 docs: add environment setup guide for development tools
d734d84 docs: add reference documents for thesis project proposal and ERMAC 2026
c52f20d docs: documentar descripcion general del proyecto
cf1a913 Merge pull request #15 from PilarEve/dev-Venus
3d8734b feat: implement MapView component with data fetching, filtering logic...
```

---

## 19. Inspeccionar el repositorio remoto (`git remote -v`)

Para verificar a qué dirección y servidor web está conectado tu repositorio local:

```bash
git remote -v
```

### Resultado real obtenido en el proyecto

```text
origin  https://github.com/PilarEve/tesis-plataforma-documentada.git (fetch)
origin  https://github.com/PilarEve/tesis-plataforma-documentada.git (push)
```

- **`origin`**: Nombre asignado al enlace remoto.
- **`(fetch)`**: Dirección URL utilizada para descargar cambios (`git pull`).
- **`(push)`**: Dirección URL utilizada para subir cambios (`git push`).

---

## 20. Conectar un repositorio local existente con GitHub

Si creaste un proyecto localmente con `git init` y deseas vincularlo a un nuevo repositorio vacío creado en GitHub:

1. **Vincular la URL remota**:
   ```bash
   git remote add origin https://github.com/Usuario/nuevo-repositorio.git
   ```
2. **Subir el código por primera vez**:
   ```bash
   git push -u origin main
   ```

---

## 21. Cambiar el repositorio remoto

Si deseas desvincular el proyecto de su repositorio actual para subirlo a una cuenta o ubicación remota independiente (por ejemplo, para crear un fork o copia propia):

1. **Eliminar la vinculación remota actual**:
   ```bash
   git remote remove origin
   ```
2. **Vincular la nueva URL remota**:
   ```bash
   git remote add origin https://github.com/TuUsuario/tu-nuevo-repositorio.git
   ```
3. **Subir los cambios a la nueva ubicación**:
   ```bash
   git push -u origin main
   ```

> [!NOTE]
> Desvincular o cambiar el `origin` local **no borra el repositorio previo en GitHub**; únicamente cambia la dirección hacia donde tu terminal enviará y descargará las actualizaciones futuras.

---

## 22. Clonar un repositorio (`git clone`)

Para descargar una copia completa de un proyecto existente en GitHub hacia tu computadora:

```bash
git clone https://github.com/PilarEve/tesis-plataforma-documentada.git
```

### Flujo habitual tras clonar un proyecto de Next.js

1. Descargar el repositorio: `git clone URL`
2. Ingresar a la carpeta creada: `cd tesis-plataforma-documentada/my-app`
3. Instalar las dependencias omitidas: `npm install`
4. Iniciar el servidor de desarrollo: `npm run dev`

---

## 23. El archivo `.gitignore`

El archivo [`.gitignore`](file:///c:/Users/Usuario/Documents/Tesis%20-%20copia/my-app/.gitignore) le indica a Git qué archivos o carpetas debe omitir deliberadamente para no incluirlos en el control de versiones.

### Inspección del `.gitignore` real del proyecto

```text
/node_modules
/.next/
.env*
.vercel
*.tsbuildinfo
```

- **`node_modules`**: Pesa cientos de megabytes y se reconstruye fácilmente con `npm install`.
- **`.next/`**: Contiene temporales de compilación generados automáticamente por Next.js.
- **`.env*`**: Contiene claves de acceso y secretos que jamás deben hacerse públicos.
- **`*.tsbuildinfo`**: Caché de compilación interna de TypeScript.

---

## 24. Variables de entorno y privacidad en GitHub

Archivos como **`.env.local`** jamás deben subirse a repositorios públicos de GitHub.

### Justificación de seguridad

Los archivos de variables de entorno contienen claves privadas de APIs, contraseñas de bases de datos de producción y URL administrativas. Si un archivo `.env.local` se sube a GitHub por descuido, atacantes o bots automáticos pueden extraer las credenciales e ingresar a tus servicios en la nube.

---

## 25. Rutina recomendada antes de hacer push

Para evitar errores o envíos incompletos, acostumbra seguir esta rutina paso a paso en la terminal:

```bash
# 1. Verificar qué archivos se modificaron
git status

# 2. Preparar los archivos deseados
git add .

# 3. Verificar que los archivos estén en Staging Area (en verde)
git status

# 4. Confirmar la versión con un mensaje descriptivo
git commit -m "docs: agregar capitulo 05 sobre Git y GitHub"

# 5. Enviar las confirmaciones a GitHub
git push
```

---

## 26. Errores frecuentes en Git y sus soluciones

### 1. `fatal: not a git repository (or any of the parent directories): .git`
- **Causa**: Estás ejecutando comandos de Git en una carpeta que no ha sido inicializada con `git init` o fuera del proyecto.
- **Solución**: Revisa tu ubicación con `pwd` e ingresa a la carpeta adecuada con `cd my-app`.

### 2. `nothing to commit, working tree clean`
- **Causa**: No es un error. Indica que no hay cambios nuevos en los archivos respecto al último commit guardado.

### 3. Push enviado a la rama equivocada
- **Causa**: No verificaste en qué rama estabas trabajando antes de hacer push.
- **Solución**: Ejecuta siempre `git branch` para confirmar la rama activa antes de enviar cambios.

### 4. Un archivo modificado no aparece en `git status`
- **Causa**: El archivo o su extensión se encuentran listados dentro de las reglas de `.gitignore`.

---

## 27. GitHub no guarda todo el contenido del disco

Es un error común pensar que un repositorio de GitHub es un duplicado idéntico en bytes de la carpeta local.

GitHub únicamente almacena el **código fuente escrito por los desarrolladores y las recetas de configuración** (`package.json`), omitiendo intencionadamente dependencias descargadas (`node_modules`) y cachés compiladas (`.next`). Esto permite que los repositorios sean livianos, rápidos de clonar y seguros.

---

## 28. Flujo de documentación progresiva utilizado en la tesis

La construcción de la documentación de este proyecto sigue este flujo estandarizado:

```text
Escribir capítulo en Markdown (ej. `docs/05-git-github/...`)
                       │
                       ▼
            git status (Revisar cambios)
                       │
                       ▼
       git add . (Preparar documentación)
                       │
                       ▼
git commit -m "docs: documentar git y github desde cero"
                       │
                       ▼
        git push (Actualizar repositorio en GitHub)
```

---

## 29. Tabla resumen de comandos esenciales

| Comando | Descripción |
| :--- | :--- |
| **`git status`** | Consulta el estado actual de los archivos y la rama activa. |
| **`git add .`** | Prepara todos los archivos modificados para el siguiente commit. |
| **`git commit -m "msg"`** | Registra una nueva versión en el historial local con un mensaje explicativo. |
| **`git push`** | Transmite los commits locales al repositorio remoto en GitHub. |
| **`git pull`** | Descarga e integra las nuevas confirmaciones desde GitHub al equipo local. |
| **`git branch`** | Lista las ramas locales disponibles e indica cuál es la activa (`*`). |
| **`git switch <rama>`** | Cambia la terminal a la rama especificada. |
| **`git switch -c <rama>`** | Crea una nueva rama e ingresa a ella inmediatamente. |
| **`git log --oneline`** | Muestra el historial cronológico de commits resumido en una línea. |
| **`git remote -v`** | Muestra la dirección URL del repositorio remoto vinculado (`origin`). |
| **`git clone <URL>`** | Descarga una copia completa de un repositorio de GitHub. |

---

## 30. Ayuda memoria

### Flujo diario en 4 pasos

```bash
git status               # 1. ¿Qué cambió?
git add .                # 2. Preparar todo
git commit -m "mensaje"  # 3. Guardar versión local
git push                 # 4. Subir a GitHub
```

### Glosario ultra-rápido

- **`status`**: Revisa los cambios pendientes.
- **`add`**: Marca y prepara los archivos.
- **`commit`**: Graba la foto del proyecto en el historial local.
- **`push`**: Envía las fotos al álbum remoto en GitHub.
- **`pull`**: Trae las novedades desde GitHub.
- **`branch`**: Consulta o gestiona líneas de desarrollo alternativas.
- **`switch`**: Se mueve de una rama a otra.
- **`remote -v`**: Comprueba a qué enlace de GitHub se envían los datos.

---

## 31. Resultado final del capítulo

Al concluir este capítulo, cualquier lector estará capacitado para:

1. Explicar la diferencia conceptual entre Git (local) y GitHub (remoto).
2. Comprender las 3 zonas de trabajo de Git (Working Directory, Staging Area, Repository).
3. Interpretar un historial real de commits con normas de nomenclatura (`docs:`, `feat:`, `fix:`).
4. Administrar ramas locales y comprender los flujos de integración colaborativa por Pull Requests.
5. Identificar por qué archivos como `.env.local` y `node_modules/` están excluidos del control de versiones a través de `.gitignore`.
