# To-Do App (Node.js + Express + MongoDB) — Starter Kit

Este starter minimal separa **auth-service** y **tasks-service** para cumplir microservicios.
Incluye JWT, validación, MongoDB y Docker Compose.

## Estructura
```
todo-app/
  auth-service/
    src/
      index.js
      routes.js
      controllers/
      middlewares/
      models/
      validators/
    package.json
    .env.example
    Dockerfile
  tasks-service/
    src/
      index.js
      routes.js
      controllers/
      middlewares/
      models/
      validators/
    package.json
    .env.example
    Dockerfile
  docker-compose.yml
  postman_collection.json
  README.md
```

## Requisitos
- Node.js 18+
- Docker (opcional) y Docker Compose
- MongoDB local o MongoDB Atlas

## Local (sin Docker)
En **auth-service** y **tasks-service**:
```bash
npm install
cp .env.example .env   # edita variables
npm run dev
```

## Variables de entorno
### auth-service
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/authdb
ACCESS_TOKEN_SECRET=change_me_access
REFRESH_TOKEN_SECRET=change_me_refresh
NODE_ENV=development
```

### tasks-service
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/tasksdb
ACCESS_TOKEN_SECRET=change_me_access
NODE_ENV=development
AUTH_ISSUER=todo-app-auth
```

## Docker
```bash
docker compose up --build
```
Servicios:
- auth-service: http://localhost:3001
- tasks-service: http://localhost:3002

## Endpoints principales
### Auth
- `POST /api/auth/register` {email, password}
- `POST /api/auth/login` {email, password} → { accessToken, refreshToken }
- `POST /api/auth/refresh` { refreshToken } → { accessToken }

### Tasks (requiere `Authorization: Bearer <accessToken>`)
- `GET /api/tasks`
- `POST /api/tasks` { title }
- `PATCH /api/tasks/:id` { title?, done? }
- `DELETE /api/tasks/:id`

## Pruebas rápidas con curl
```bash
# Registro
curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"email":"a@a.com","password":"12345678"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"a@a.com","password":"12345678"}' | jq -r .accessToken)

# Crear tarea
curl -X POST http://localhost:3002/api/tasks -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title":"Comprar leche"}'

# Listar tareas
curl -H "Authorization: Bearer $TOKEN" http://localhost:3002/api/tasks
```


## Frontend mínimo (HTML + JS)

Ruta: `frontend/`

1) Abre `frontend/index.html` en tu navegador (puede funcionar con doble clic).  
   - Si el navegador bloquea llamadas `http://localhost` por CORS/puertos, usa una extensión de “Live Server” (VS Code) o un servidor estático:
   ```bash
   npx http-server ./frontend -p 5173
   ```
   y abre `http://localhost:5173`.

2) Configura las URLs base en la tarjeta “Configuración rápida” si cambiaste puertos o estás en la nube.

3) Flujo:
   - Crea cuenta o usa “Cuenta de prueba” para autollenar.
   - Haz login → se guarda el **accessToken** en `localStorage`.
   - Crea, lista, marca como hecho o borra tareas.
