# 📌 Todo App con Microservicios (Auth + Tasks)

Este proyecto es una aplicación **To-Do List** construida con una arquitectura de **microservicios**.  
Incluye autenticación de usuarios y gestión de tareas, usando **Node.js**, **Express**, **MongoDB** y **Docker Compose**.

---

## 🚀 Tecnologías utilizadas

- **Node.js** y **Express** → Servicios backend.
- **MongoDB** → Base de datos.
- **Docker Compose** → Orquestación de contenedores.
- **JWT (JSON Web Tokens)** → Autenticación.
- **HTML + JavaScript** → Frontend sencillo.

---

## 📂 Estructura del proyecto

```
todo-app/
│── auth-service/      # Servicio de autenticación (login, registro, refresh tokens)
│── tasks-service/     # Servicio de tareas (CRUD de tareas)
│── frontend/          # Cliente simple con HTML y JS
│── docker-compose.yml # Orquestación de servicios
│── .gitignore
│── README.md
```

---

## ⚙️ Configuración del entorno

Cada microservicio necesita un archivo `.env`.  
Incluimos un **`.env.example`** que debes copiar y renombrar:

```bash
cp auth-service/.env.example auth-service/.env
cp tasks-service/.env.example tasks-service/.env
```

### Variables principales

```env
# auth-service
PORT=3001
MONGODB_URI=mongodb://mongo:27017/authdb
ACCESS_TOKEN_SECRET=dev_access_secret
REFRESH_TOKEN_SECRET=dev_refresh_secret
NODE_ENV=development

# tasks-service
PORT=3002
MONGODB_URI=mongodb://mongo:27017/tasksdb
ACCESS_TOKEN_SECRET=dev_access_secret
NODE_ENV=development
AUTH_ISSUER=todo-app-auth
```

---

## ▶️ Cómo ejecutar el proyecto

### 1. Con Docker (recomendado)

Asegúrate de tener instalado [Docker Desktop](https://www.docker.com/).  
En la raíz del proyecto (`todo-app/`):

```bash
docker compose up --build
```

Esto levantará:

- MongoDB en `localhost:27017`
- Auth Service en `http://localhost:3001`
- Tasks Service en `http://localhost:3002`
- Frontend en `http://localhost:5500` (si usas Live Server o similar)

### 2. En modo desarrollo (sin Docker)

Ejecuta cada servicio en su carpeta:

```bash
cd auth-service
npm install
npm run dev
```

```bash
cd tasks-service
npm install
npm run dev
```

Y abre el `frontend/index.html` con Live Server.

---

## 📌 Endpoints principales

### 🔑 Auth Service (`http://localhost:3001`)

- `POST /register` → Registrar usuario
  ```json
  { "email": "user@mail.com", "password": "12345678" }
  ```
- `POST /login` → Login y devuelve `accessToken` y `refreshToken`

### ✅ Tasks Service (`http://localhost:3002`)

- `GET /tasks` → Listar tareas (requiere `Authorization: Bearer <token>`)
- `POST /tasks` → Crear tarea
- `PUT /tasks/:id` → Editar tarea
- `DELETE /tasks/:id` → Eliminar tarea

---

## 👤 Usuario demo

Para pruebas rápidas ya existe un usuario demo:

```
email: demo@demo.com
password: 12345678
```

---

## ✅ Requisitos académicos cumplidos

- Uso de **Node.js y Express**
- **Microservicios** (Auth + Tasks)
- **MongoDB** como base de datos
- Manejo de **variables de entorno**
- **Autenticación con JWT**
- Despliegue local con **Docker Compose**
- Buenas prácticas con **`.gitignore`**

---

## 📜 Licencia

Este proyecto es solo con fines educativos.  
Desarrollado por **Alberto Rebolledo (@deathbeto)**.
