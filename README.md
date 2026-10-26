# RECETARIO - Plataforma Gastronómica

Plataforma web gastronómica moderna, interactiva y responsiva desarrollada bajo una arquitectura desacoplada (Frontend SPA en React 19 + TypeScript y Backend API REST en Node.js, Express y Prisma ORM). Permite explorar catálogos de cocina, ajustar proporcionalmente los ingredientes mediante una calculadora matemática didáctica, controlar tiempos de cocción con un temporizador auditivo, gestionar colecciones de favoritos y administrar contenidos mediante un sistema estricto de control de acceso basado en roles (RBAC).

---

## 1. Demostración en Línea y Despliegue

La plataforma se encuentra desplegada y operativa en entornos cloud:

* **Frontend Web (Vercel):** [https://recetario-virid.vercel.app](https://recetario-virid.vercel.app)
* **Backend API REST (Render):** [https://recetario-2wri.onrender.com/api/v1](https://recetario-2wri.onrender.com/api/v1)
* **Comprobación de Salud del Servidor:** [https://recetario-2wri.onrender.com/api/v1/health](https://recetario-2wri.onrender.com/api/v1/health)
* **Base de Datos:** PostgreSQL en la nube administrado mediante Supabase.

---

## 2. Características Principales

* **Calculadora Proporcional de Porciones:** Ajusta en tiempo real la cantidad exacta de ingredientes para cualquier número de comensales mediante una regla de tres simple, mostrando el factor multiplicador correspondiente.
* **Temporizador de Cocina Integrado (`CookTimer`):** Temporizador paso a paso con indicador de progreso radial, controles de pausa y reinicio, y notificación auditiva sintetizada mediante Web Audio API al concluir el tiempo.
* **Checklist Interactivo de Cocina:** Permite al usuario marcar ingredientes pesados y pasos completados durante la preparación.
* **Control de Acceso Basado en Roles (RBAC):** Separación estricta de privilegios para comensales (`USUARIO`), creadores culinarios (`CHEF`) y administradores globales (`ADMIN`).
* **Panel de Control Administrativo (`AdminPanel`):** Tablero modular con tres secciones: moderación global de recetas con vista previa y confirmación, gestión de categorías dinámicas y administración de usuarios con cambio de rol en vivo.
* **Publicación y Edición Multimedia (`RecetaForm`):** Soporte dual para subida local de archivos de imagen mediante `multipart/form-data` o enlaces URL externos, con administración dinámica de ingredientes y pasos ordenados.
* **Resiliencia de Red y Monitoreo de Cold Start:** Detección en vivo del estado del backend en Render (`useBackendStatus` e `IndicadorBackend`) con cálculo de latencia en milisegundos y pausa de sondeo en pestañas inactivas mediante Page Visibility API.
* **Fallback Automático de Imágenes:** Protección ante enlaces caídos o imágenes no disponibles, reemplazándolas por una fotografía culinaria de alta calidad sin mostrar iconos rotos en pantalla.
* **Soporte de Tema Claro / Oscuro:** Conmutador de tema visual accesible con persistencia en `localStorage`.
* **Diseño Mobile-First Estricto:** Adaptabilidad en resoluciones móviles, tabletas y computadoras de escritorio, sin desbordamiento horizontal.
* **Cero Hardcoding:** Centralización exhaustiva de cadenas y mensajes en `texts.js` (frontend) y `mensajes.ts` (backend).

---

## 3. Arquitectura del Sistema

La solución implementa un monorepo desacoplado comunicado a través de una API REST que transmite datos serializados en JSON sobre HTTP/HTTPS:

```mermaid
graph TD
    Client["Cliente Web SPA (React 19 + TypeScript + Vite)"]
    API["API REST Backend (Node.js + Express + Prisma)"]
    DB[("Base de Datos PostgreSQL (Supabase)")]
    Static["Almacenamiento Local de Imagenes (/uploads)"]

    Client -- "Peticiones HTTP / JSON" --> API
    API -- "Consultas Prisma ORM" --> DB
    API -- "Subida de Archivos (Multer)" --> Static
    Static -- "Servicio de Archivos Estaticos" --> Client
```

### Estructura de Directorios

```
Recetario/
├── backend/                        # Capa de Servidor y Logica de Negocio
│   ├── prisma/
│   │   ├── schema.prisma           # Esquema relacional de base de datos
│   │   └── dev.db                  # Base de datos de respaldo
│   ├── src/
│   │   ├── config/                 # Cliente Prisma centralizado
│   │   ├── constants/              # Mensajes y respuestas del servidor
│   │   ├── controllers/            # Controladores HTTP por dominio
│   │   ├── middlewares/            # JWT, Role Guard, Error Handler, Multer
│   │   ├── routes/                 # Rutas de la API (/api/v1)
│   │   ├── services/               # Logica de negocio y Seeder automatico
│   │   ├── types/                  # Tipado TypeScript
│   │   └── server.ts               # Punto de entrada Express
│   └── uploads/                    # Directorio de fotos subidas
│
├── recetario/                      # Capa de Cliente e Interfaz de Usuario
│   ├── public/                     # Favicons y logotipos
│   ├── src/
│   │   ├── assets/                 # Recursos graficos
│   │   ├── components/             # Componentes modulares y reutilizables
│   │   │   ├── AdminPanel/         # Pestañas de moderacion, categorias y usuarios
│   │   │   ├── Auth/               # Modal de login y registro
│   │   │   ├── Buscador/           # Barra de busqueda
│   │   │   ├── Navbar/             # Barra de navegacion con RBAC
│   │   │   ├── RecetaForm/         # Formulario de creacion / edicion de recetas
│   │   │   ├── RecipeCard/         # Tarjeta de presentacion de receta
│   │   │   └── shared/             # Toast, ErrorBoundary, IndicadorBackend
│   │   ├── config/                 # Cliente fetch centralizado
│   │   ├── constants/              # Textos centralizados de la interfaz
│   │   ├── context/                # AuthContext con almacenamiento de sesion
│   │   ├── hooks/                  # Custom hooks (useRecetas, useAdmin, etc.)
│   │   ├── pages/                  # Vistas (Inicio, ListaReceta, Receta)
│   │   ├── services/               # Clientes API por modulo
│   │   ├── types/                  # Modelos y contratos de TypeScript
│   │   └── utils/                  # Utilidades de resolucion de imagenes
│   └── vite.config.ts              # Configuracion de Vite y Proxy inverso
│
├── iniciar-red-local.bat           # Iniciador de red local multi-dispositivo
└── README.md                       # Documentacion general del repositorio
```

---

## 4. Stack Tecnológico

| Capa | Tecnologia / Herramienta | Version | Proposito |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | 19.2 | Libreria base de interfaz declarativa |
| **Frontend** | TypeScript | 6.0 | Tipado estricto en toda la aplicacion |
| **Frontend** | Vite | 8.0 | Entorno de desarrollo y empaquetador veloz con HMR |
| **Frontend** | Lucide React | 1.31 | Iconografia vectorial semantica |
| **Frontend** | Vanilla CSS | 3 | Estilos modulares con variables CSS y tema oscuro |
| **Backend** | Node.js | 20+ | Entorno de ejecucion en servidor |
| **Backend** | Express | 4.21 | Framework para endpoints HTTP y middlewares |
| **Backend** | Prisma ORM | 6.4 | Mapeo objeto-relacional y migraciones de BD |
| **Backend** | TypeScript | 5.7 | Tipado estricto del servidor |
| **Backend** | jsonwebtoken | 9.0 | Generacion y validacion de tokens Bearer JWT |
| **Backend** | bcryptjs | 3.0 | Cifrado unidireccional de contraseñas |
| **Backend** | Multer | 2.2 | Procesamiento de subida de archivos multipart |
| **Backend** | Zod | 3.24 | Validacion de esquemas y cargas de datos |
| **Base de Datos**| PostgreSQL (Supabase) | 15+ | Motor de base de datos relacional en la nube |

---

## 5. Control de Acceso Basado en Roles (RBAC)

La aplicacion implementa tres niveles jerarquicos de autorizacion:

| Rol | Privilegios y Funciones |
| :--- | :--- |
| **`USUARIO`** | Consultar recetas, utilizar la calculadora didactica y temporizador, guardar o quitar recetas en **Favoritos**, y alternar el tema visual claro/oscuro. |
| **`CHEF`** | Todas las capacidades de `USUARIO`, adicionando la facultad de publicar nuevas recetas con ingredientes, pasos y fotografias, asi como editar y eliminar exclusivamente sus propias recetas. |
| **`ADMIN`** | Maximo nivel de privilegios. Incluye todas las facultades de `CHEF` y añade acceso al **Panel de Administracion** para moderacion global (eliminar cualquier receta), gestion en vivo de categorias y modificacion del rol de cualquier usuario registrado. |

### Cuentas Semilla de Prueba (Seeder)

El servidor inicializa automaticamente cuentas de prueba preconfiguradas con contraseñas seguras mediante el servicio `seeder.service.ts`:

| Rol | Nombre de Usuario | Correo Electronico | Contraseña por Defecto |
| :--- | :--- | :--- | :--- |
| **`ADMIN`** | Chef Administrador | `admin@recetario.com` | `123123` |
| **`CHEF`** | Chef Ejecutivo | `chef@recetario.com` | `123123` |
| **`USUARIO`** | Registro libre en la aplicacion | *(Definido por el usuario)* | *(Definida por el usuario)* |

---

## 6. Modelo de Datos Relacional (Prisma)

```mermaid
erDiagram
    USUARIO ||--o{ RECETA : "publica"
    USUARIO ||--o{ FAVORITO : "guarda"
    CATEGORIA ||--o{ RECETA : "clasifica"
    RECETA ||--o{ INGREDIENTE : "contiene"
    RECETA ||--o{ PASO_PREPARACION : "instruye"
    RECETA ||--o{ FAVORITO : "es_guardada"

    USUARIO {
        string id PK
        string nombre
        string email UK
        string passwordHash
        string rol "USUARIO | CHEF | ADMIN"
        datetime creadoEn
    }

    CATEGORIA {
        string id PK
        string nombre UK
        string slug UK
        string icono
        string descripcion
    }

    RECETA {
        string id PK
        string titulo
        string slug UK
        string descripcion
        int tiempoPreparacionMinutos
        int tiempoCoccionMinutos
        int porciones
        string dificultad "FACIL | MEDIA | DIFICIL"
        string imagenUrl
        string categoriaId FK
        string autorId FK
    }

    INGREDIENTE {
        string id PK
        string recetaId FK
        string nombre
        string cantidad
        string unidad
        int ordenIndice
    }

    PASO_PREPARACION {
        string id PK
        string recetaId FK
        int numeroPaso
        string instruccion
        string imagenUrl
    }

    FAVORITO {
        string usuarioId PK,FK
        string recetaId PK,FK
        datetime creadoEn
    }
```

---

## 7. Catalogo de Endpoints de la API REST (`/api/v1`)

### Autenticacion y Usuarios
* `POST /api/v1/auth/registro`: Registra un nuevo comensal.
* `POST /api/v1/auth/login`: Autentica credenciales y devuelve el token JWT con los datos del usuario.
* `GET /api/v1/auth/perfil`: Retorna el perfil del usuario autenticado (requiere cabecera `Authorization: Bearer <TOKEN>`).

### Recetas y Categorias
* `GET /api/v1/recetas/categorias`: Obtiene la lista completa de categorias gastronomicas.
* `GET /api/v1/recetas`: Retorna el catalogo de recetas paginado con soporte para filtros por query params (`busqueda`, `categoria`, `dificultad`, `tiempoMaximo`, `pagina`, `limite`).
* `GET /api/v1/recetas/:slug`: Obtiene el detalle de una receta especifica por su slug amigable.
* `POST /api/v1/recetas`: Crea una nueva receta con sus ingredientes y pasos (requiere rol `CHEF` o `ADMIN`).
* `PUT /api/v1/recetas/:id`: Actualiza una receta existente (requiere rol `CHEF` propietario o `ADMIN`).
* `DELETE /api/v1/recetas/:id`: Elimina una receta (requiere rol `CHEF` propietario o `ADMIN`).

### Multimedia
* `POST /api/v1/upload`: Carga una fotografia de receta al servidor en formato `multipart/form-data` con campo `foto` (requiere rol `CHEF` o `ADMIN`).

### Favoritos
* `GET /api/v1/favoritos`: Lista las recetas marcadas como favoritas por el usuario autenticado.
* `GET /api/v1/favoritos/ids`: Retorna el arreglo de identificadores de recetas guardadas.
* `POST /api/v1/favoritos/:recetaId`: Alterna el estado de favorito (lo añade si no existia, o lo remueve si ya estaba guardado).

### Panel de Administracion (Exclusivo Rol `ADMIN`)
* `GET /api/v1/admin/usuarios`: Lista todos los usuarios registrados con soporte de busqueda por nombre o correo.
* `PATCH /api/v1/admin/usuarios/:id/rol`: Cambia el rol de un usuario (`USUARIO`, `CHEF`, `ADMIN`).
* `POST /api/v1/admin/categorias`: Crea una nueva categoria gastronomica.
* `PUT /api/v1/admin/categorias/:id`: Actualiza el nombre o descripcion de una categoria.
* `DELETE /api/v1/admin/categorias/:id`: Elimina una categoria.
* `DELETE /api/v1/admin/recetas/:id`: Moderacion global: elimina cualquier receta de la plataforma de forma forzada.

### Monitoreo
* `GET /api/v1/health`: Devuelve el estado operativo, version y marca de tiempo del backend.

---

## 8. Acceso en Red Local y Multi-Dispositivo (Móvil / Tablet)

Para visualizar y probar la aplicacion en tiempo real desde un telefono celular, tablet u otra computadora conectada a la misma red Wi-Fi o red de area local (LAN), el proyecto incluye un iniciador automatizado en Windows:

### Ejecucion con un Solo Clic: `iniciar-red-local.bat`

1. Haz doble clic en el archivo `iniciar-red-local.bat` ubicado en la raiz del proyecto.
2. El script detectara automaticamente la direccion IP activa de tu adaptador de red principal (Wi-Fi o Ethernet).
3. Abrira dos terminales independientes:
   * **Consola Backend Express:** ejecutando en el puerto `4000`.
   * **Consola Frontend Vite:** ejecutando en el puerto `5173` con el parametro `--host`.
4. La consola principal te indicara la URL exacta para ingresar desde tu telefono movil:
   ```
   http://<TU_IP_LOCAL>:5173
   ```
5. Abre el navegador de tu telefono movil (conectado a la misma red Wi-Fi) e ingresa dicha direccion.

### Arquitectura de Proxy Inverso en Red
El frontend utiliza un **Reverse Proxy en Vite (`vite.config.ts`)** que intercepta las peticiones dirigidas a `/api` y `/uploads` y las redirige internamente hacia `http://localhost:4000`. Gracias a este mecanismo:
* No se requiere configurar direcciones IP estaticas en archivos `.env`.
* Se eliminan completamente los problemas de bloqueo por CORS entre dispositivos.
* Las fotografias y endpoints funcionan de forma transparente en cualquier dispositivo.

---

## 9. Instalacion y Puesta en Marcha Manual

Si prefieres iniciar los servicios manualmente por terminal, sigue los siguientes pasos:

### Prerrequisitos
* Node.js v20 o superior instalado.
* Gestor de paquetes `npm`.
* Instancia de PostgreSQL (local o servicio en la nube como Supabase).

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/Recetario.git
cd Recetario
```

### Paso 2: Configuracion y Levantamiento del Backend
```bash
# Entrar a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno (crear .env a partir del ejemplo)
copy .env.example .env

# Sincronizar el esquema de Prisma con la base de datos
npx prisma db push

# Iniciar el servidor en modo desarrollo
npm run dev
```
El servidor backend estara escuchando en `http://localhost:4000` e inicializara automaticamente los seeders de usuarios y recetas.

### Paso 3: Configuracion y Levantamiento del Frontend
En una nueva terminal:
```bash
# Entrar a la carpeta del frontend
cd recetario

# Instalar dependencias
npm install

# Configurar variables de entorno (crear .env a partir del ejemplo)
copy .env.example .env

# Iniciar servidor de desarrollo Vite con acceso de red
npm run dev -- --host
```
La aplicacion estara disponible en `http://localhost:5173`.

---

## 10. Variables de Entorno

### Backend (`backend/.env`)
```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=super-secreto-jwt-llave-recetario-2026
DATABASE_URL="postgresql://postgres:contrasena@localhost:5432/recetario_db?schema=public"
```

### Frontend (`recetario/.env`)
```env
# Modo Red Local / Desarrollo (con Proxy inverso de Vite)
VITE_API_URL=/api/v1

# Modo Nube (Descomentar para conectar directamente con el Backend en Render)
# VITE_API_URL=https://recetario-2wri.onrender.com/api/v1
```

---

## 11. Estandar de Commits Git

Todo commit realizado en el proyecto sigue estrictamente el formato convencional establecido en las normas de desarrollo:

```
<tipo>[<CAPA>]: <descripcion clara en español>
```

### Tipos Permitidos
* `feat`: Nueva funcionalidad.
* `fix`: Correccion de un error o defecto.
* `refactor`: Refactorizacion de codigo sin alterar la logica publica.
* `perf`: Mejora de rendimiento.
* `docs`: Documentacion y guias.
* `test`: Pruebas unitarias o de integracion.

### Capas Permitidas
* `[FRONT]`: Modificaciones en el cliente React / Vite.
* `[BACK]`: Modificaciones en la API REST Express / Prisma.
* `[DB]`: Migraciones o cambios en el esquema de base de datos.
* `[DOCS]`: Documentacion del proyecto.

### Ejemplos Validos
* `feat[BACK]: Implementar endpoint de busqueda avanzada de recetas`
* `feat[FRONT]: Implementar temporizador CookTimer con alertas sonoras`
* `fix[FRONT]: Corregir resolucion de URLs relativas en proxy de imagenes`
* `docs[DOCS]: Actualizar README principal con guia de acceso en red local`

---

## 12. Licencia

Este proyecto fue desarrollado con fines educativos y de demostracion como plataforma gastronomica web de alta fidelidad. Todos los derechos reservados.
