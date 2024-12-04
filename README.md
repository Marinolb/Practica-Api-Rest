# Practica API REST - Cliente y Servidor para Consumo de API REST


## Descripción del Proyecto

Este proyecto tiene como objetivo consumir y exponer una API REST utilizando las siguientes tecnologías:
- **Backend**: Spring Boot, un marco de desarrollo para aplicaciones Java basado en el principio de inyección de dependencias y configuración automática.
- **Frontend**: React, una biblioteca de JavaScript para la construcción de interfaces de usuario interactivas.
- **Docker**: Herramienta que facilita la creación, despliegue y ejecución de aplicaciones mediante contenedores.

## Funcionalidad de la API REST

El backend expone varias rutas para la gestión de diferentes tipos de datos (`json`, `csv`, `txt`). Cada ruta permite las operaciones CRUD estándar (GET, POST, PUT, DELETE). Estas rutas son accesibles a través de los siguientes endpoints:

- **Endpoints disponibles**:
  - `/api/json`
  - `/api/csv`
  - `/api/txt`

- **Operaciones**:
  - **GET**: Obtener datos.
  - **POST**: Crear nuevos datos.
  - **PUT**: Actualizar datos existentes.
  - **DELETE**: Eliminar datos.

## Requisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu máquina local:
- Docker (para crear contenedores)
- Docker Compose (para gestionar múltiples contenedores)
- Java 23+ (para ejecutar Spring Boot)
- Node.js 18+ (para ejecutar la aplicación React)

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```bash
/PracticaU2
  /backend             # Código fuente del servidor Spring Boot
    /src               # Código fuente Java de la API REST
    /storage	       # Ubicación de archivos de prueba para CRUD
    /Dockerfile        # Dockerfile para construir el backend
    /pom.xml           # Archivo de configuración de Maven para el backend
  /frontend            # Código fuente del cliente React
    /public            # Archivos públicos de React (HTML, imágenes, etc.)
    /src               # Código fuente JavaScript de React
    /Dockerfile        # Dockerfile para construir el frontend
    /package.json      # Archivo de dependencias y configuración de React
  /docker-compose.yml  # Archivo de configuración de Docker Compose
  /README.md           # Este archivo
```

## Configuración y Ejecución del Proyecto

1. **Clonar el repositorio**
   Clona este repositorio a tu máquina local:

```bash
git clone https://github.com/Marinolb/Practica-Api-Rest
cd PracticaU2
```

2. **Construir y Levantar los Contenedores con Docker**
Una vez que tengas el repositorio clonado y te encuentres en la raíz del proyecto, puedes levantar los contenedores usando Docker Compose.

docker-compose up --build

Este comando realizará lo siguiente:
- Construirá las imágenes de Docker para el frontend y el backend.
- Levantará los contenedores correspondientes.
- Expondrá los siguientes puertos:
  - El frontend estará disponible en [http://localhost:3000](http://localhost:3000)
  - El backend estará disponible en [http://localhost:8080](http://localhost:8080)

3. **Variables de Entorno**
- **Frontend**:
  - `REACT_APP_API_URL`: La URL donde el frontend realizará las peticiones al backend (por defecto [http://backend:8080/api](http://backend:8080/api)).
- **Backend**:
  - `SPRING_PROFILES_ACTIVE`: Configura el perfil de Spring Boot (por defecto `dev`).

4. **Acceder a la Aplicación**
Una vez que los contenedores estén corriendo, puedes acceder a:
- El cliente React en [http://localhost:3000](http://localhost:3000)
- La API REST de Spring Boot en [http://localhost:8080/api](http://localhost:8080/api)

## Arquitectura

El proyecto está basado en una arquitectura cliente-servidor, donde el frontend (React) actúa como cliente que consume las rutas de la API REST proporcionadas por el backend (Spring Boot). La comunicación entre los dos servicios se realiza mediante HTTP, y Docker se utiliza para tener en contenedores ambos servicios y facilitar su ejecución, asegurando que los servicios puedan ejecutarse en cualquier entorno de desarrollo sin problemas de compatibilidad.

## Notas

- **CORS**: El backend está configurado para permitir peticiones desde el frontend mediante configuraciones CORS adecuadas.



## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
