# Terpel Tech Day - Suite de Aplicaciones

Este proyecto es una suite de aplicaciones desarrollada para el Terpel Tech Day, que incluye un juego interactivo y un sistema de inscripciones.

## 🏗️ Arquitectura del Proyecto

El proyecto está estructurado como una aplicación full-stack con:

- **Frontend**: Aplicación React con Vite
- **Backend**: API REST con Node.js y Express
- **Base de Datos**: MongoDB con Mongoose

## 📁 Estructura del Proyecto

```
TerpelTechDay/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios de API
│   │   └── contexts/       # Contextos de React
│   └── public/             # Archivos estáticos
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/         # Rutas de la API
│   │   ├── models/         # Modelos de Mongoose
│   │   ├── utils/          # Utilidades
│   │   └── data/           # Datos del juego
│   └── package.json
└── agentes.txt            # Información de agentes
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### Configuración del Backend

1. Navega al directorio del servidor:
```bash
cd server
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
# Crea un archivo .env en la carpeta server/
MONGO_URI=mongodb://localhost:27017/terpel-tech-day
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

4. Inicia el servidor:
```bash
npm run dev
```

### Configuración del Frontend

1. Navega al directorio del cliente:
```bash
cd client
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🎮 Funcionalidades

### Juego Interactivo
- Sistema de preguntas y respuestas
- Tarjetas de aprendizaje
- Modal de preguntas
- Gestión de sesiones de juego

### Sistema de Inscripciones
- Formulario de registro de participantes
- Validación de datos
- Almacenamiento en base de datos

## 🔧 API Endpoints

### Juego
- `GET /api/game/sessions` - Obtener sesiones de juego
- `POST /api/game/sessions` - Crear nueva sesión
- `GET /api/game/questions` - Obtener preguntas del juego

### Inscripciones
- `GET /api/inscritos` - Obtener lista de inscritos
- `POST /api/inscritos` - Registrar nuevo participante

### Utilidades
- `GET /health` - Health check del servidor
- `GET /api/diagnostico` - Diagnóstico de conexión a BD

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- CSS3
- JavaScript ES6+

### Backend
- Node.js
- Express.js
- Mongoose
- CORS
- dotenv

### Base de Datos
- MongoDB
- Mongoose ODM

## 📝 Scripts Disponibles

### Backend
- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo con nodemon

### Frontend
- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

Desarrollado para el Terpel Tech Day 2024.

---

**Nota**: Asegúrate de configurar correctamente las variables de entorno antes de ejecutar la aplicación.
