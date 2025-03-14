# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# Funcionalidades y Endpoints de la Aplicación SlowFood

Después de revisar todo el código, he identificado las siguientes funcionalidades y endpoints que podrías incluir en el README de tu aplicación SlowFood:

## Funcionalidades de la Aplicación SlowFood

### Autenticación de Usuarios
- Registro de nuevos usuarios
- Inicio de sesión con correo electrónico y contraseña
- Autenticación mediante tokens JWT
- Cierre de sesión

### Gestión de Perfiles
- Ver perfil propio y de otros usuarios
- Editar información del perfil (nombre, biografía, imagen)
- Sistema de seguidores (seguir/dejar de seguir a otros usuarios)
- Ver listas de seguidores y seguidos

### Gestión de Recetas
- Crear nuevas recetas con imágenes, ingredientes e instrucciones
- Visualizar recetas propias y de otros usuarios
- Editar recetas existentes
- Eliminar recetas
- Filtrar recetas por varios criterios (ingredientes, dieta, dificultad, etc.)
- Receta aleatoria destacada ("Receta del Día")
- Paginación de resultados

### Interacción con Recetas
- Sistema de "Me gusta" para recetas
- Comentarios en recetas
- Editar y eliminar comentarios propios

### Subida de Archivos
- Carga de imágenes para recetas y perfiles (integración con Cloudinary)

### Interfaz Adaptativa
- Diseño responsive para móviles y escritorio
- Navegación intuitiva con menú adaptable

## Endpoints de la API

### Autenticación
- `POST /auth/signup` - Registro de nuevos usuarios
- `POST /auth/login` - Iniciar sesión y obtener token JWT
- `GET /auth/verify` - Verificar token JWT válido

### Usuarios
- `GET /api/users` - Obtener lista de todos los usuarios
- `GET /api/users/:id` - Obtener información de un usuario específico
- `GET /api/users/discover` - Descubrir usuarios para seguir (que no sigues actualmente)
- `POST /api/users/:id/follow` - Seguir a un usuario
- `POST /api/users/:id/unfollow` - Dejar de seguir a un usuario
- `GET /api/users/:id/followers` - Obtener seguidores de un usuario
- `GET /api/users/:id/following` - Obtener a quién sigue un usuario
- `PUT /api/users/profile` - Actualizar perfil de usuario

### Recetas
- `POST /api/recipes` - Crear una nueva receta
- `GET /api/recipes` - Obtener todas las recetas (con paginación)
- `GET /api/recipes/my-recipes` - Obtener recetas del usuario autenticado
- `GET /api/recipes/random` - Obtener una receta aleatoria
- `GET /api/recipes/author/:id` - Obtener recetas de un autor específico
- `GET /api/recipes/:id` - Obtener una receta específica
- `PUT /api/recipes/:id` - Actualizar una receta existente
- `DELETE /api/recipes/:id` - Eliminar una receta
- `POST /api/recipes/:id/like` - Dar "me gusta" a una receta
- `POST /api/recipes/:id/unlike` - Quitar "me gusta" de una receta
- `GET /api/recipes/filter` - Filtrar recetas por criterios (ingredientes, dieta, etc.)

### Comentarios
- `POST /api/comments` - Crear un nuevo comentario
- `GET /api/comments/:recipeId` - Obtener comentarios de una receta específica
- `PUT /api/comments/:id` - Editar un comentario existente
- `DELETE /api/comments/:id` - Eliminar un comentario
- `POST /api/recipes/:id/comments` - Añadir un comentario a una receta específica

### Subida de Archivos
- `POST /api/upload` - Subir imágenes (a Cloudinary)

## Tecnologías Utilizadas

- **Frontend**: React, React Router, Context API, Axios, TailwindCSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Autenticación**: JWT, bcrypt
- **Almacenamiento de imágenes**: Cloudinary
- **Herramientas de desarrollo**: Nodemon, Morgan, CORS

## Instalación y Ejecución

### Requisitos Previos
- Node.js y npm instalados
- MongoDB instalado y ejecutándose
- Cuenta en Cloudinary (para almacenamiento de imágenes)

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

### Variables de Entorno

El backend requiere las siguientes variables de entorno:
- `MONGODB_URI`: URL de conexión a MongoDB
- `TOKEN_SECRET`: Secreto para firmar tokens JWT
- `ORIGIN`: URL del frontend (por defecto: http://localhost:3000)
- `PORT`: Puerto para el servidor (por defecto: 5005)
- `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`: Credenciales de Cloudinary

El frontend requiere:
- `REACT_APP_SERVER_URL`: URL del backend (por defecto: http://localhost:5005)