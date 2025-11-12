# 🎬 CinemaApp – CRUD de Películas y Directores

Aplicación full-stack de ejemplo con **.NET 9 (Minimal API)**, **SQL Server** y **Angular 20 + Material UI**.  
Permite administrar directores y películas (CRUD completo), conectados por relaciones 1-a-N.

---

## 🚀 Requisitos previos

- **Docker & Docker Compose** instalados  
  👉 [https://docs.docker.com/get-docker](https://docs.docker.com/get-docker)
- **Node.js ≥ 18** (solo si deseas ejecutar el frontend localmente fuera de Docker)
- **.NET SDK 9** (solo si deseas correr el backend sin contenedor)

---


## 🐳 Ejecución con Docker Compose
Clona el repositorio

https://github.com/DanielAguilar13/cinemaApp_CRUD.git
cd cinemaApp_CRUD

Construye y levanta los servicios

docker compose up --build

Para terminar con los contenedores 

docker compose down -v

## 🧠 Stack técnico
**Backend**

.NET 9 Minimal API

Entity Framework Core

SQL Server 2022

Swagger (Swashbuckle)

CORS habilitado para el frontend

**Frontend**

Angular 20

Material Icons

CSS
