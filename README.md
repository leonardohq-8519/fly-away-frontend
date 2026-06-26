# Fly Away - Frontend

Desafios completados:

| Funcionalidad | Must Have | Nice to Have |
|---------------|-----------|--------------|
| Registro | ✅ | — |
| Login | ✅| ✅ |
| Búsqueda de vuelos | ✅ | ✅ |
| Reservar vuelo |✅| ✅ |
| Mis reservas | — | ✅ |
| Cerrar sesión & navegación | ✅ | — |

## Componentes Principales

La aplicación está estructurada utilizando los siguientes componentes:

* **`App.tsx`**: Componente principal que maneja el enrutamiento y contiene la barra de navegación persistente.
* **`Register.tsx`**: Formulario para la creación de nuevas cuentas de usuario.
* **`Login.tsx`**: Maneja la autenticación de usuarios y el almacenamiento del JWT en el `localStorage`.
* **`Search.tsx`**: Pantalla principal (Home) que permite buscar vuelos por aerolínea, número de vuelo y fechas. También permite realizar reservas.
* **`MyBookings.tsx`**: Panel privado del usuario que muestra el historial de sus reservas.

## Dependencias Requeridas

Se utilizó [Vite](https://vitejs.dev/) y las siguientes dependencias:

* `react` y `react-dom`: Librería principal para la construcción de interfaces.
* `react-router-dom`: Manejo de rutas y navegación.
* `axios`: Peticiones HTTP al backend + Interceptores para inyectar el token JWT automaticamente.

> El proyecto incluye una configuración de **Proxy en `vite.config.ts`** para redirigir las peticiones a `localhost:8080`.

## Cómo ejecutar el proyecto

1. Instalar **Node.js**.
2. Abrir terminal en la carpeta raiz del repositorio clonado.
3. Instalar las dependencias ejecutando:
   ```
   npm install
   ```
4. Levantar el servidor de desarrollo ejecutando:
    ```
    npm run dev
    ```
5. Abrir URL http://localhost:5173