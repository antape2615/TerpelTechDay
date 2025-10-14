# 🏆 Podio Perxia Suite - Resultados

Frontend para mostrar el podio de los 3 mejores tiempos del juego Perxia Suite.

## 🚀 Características

- **Podio visual**: Muestra los 3 mejores tiempos en formato de podio
- **Identidad de marca**: Diseño con colores de Periferia (verde)
- **Responsive**: Se adapta a móviles y desktop
- **Tiempo real**: Consulta la base de datos de inscritos
- **Filtrado inteligente**: Solo muestra participantes que completaron el juego

## 🎨 Diseño

- **Colores de Periferia**: Verde (#00FF88) a verde oscuro (#1a5f3f)
- **Podio animado**: Medallas de oro, plata y bronce
- **Información completa**: Nombre, cargo, tiempo y puntuación
- **Efectos visuales**: Animaciones y hover effects

## 📊 Datos Mostrados

Para cada participante:
- 🥇🥈🥉 Posición en el podio
- 👤 Nombre completo
- 💼 Cargo/posición
- ⏱️ Tiempo total del juego
- 📊 Puntuación final (X/9)

## 🔧 Configuración

### Variables de Entorno
```env
VITE_API_URL=https://terpeltechday.onrender.com/api
```

### Desarrollo
```bash
npm install
npm run dev
```

### Producción
```bash
npm run build
```

## 🌐 Despliegue

Este frontend se puede desplegar en:
- Render (Static Site)
- Vercel
- Netlify
- GitHub Pages

## 📱 Responsive (Optimizado para Desktop)

- **Desktop/Pantallas Grandes**: Podio horizontal con 3 columnas, elementos grandes y espaciados
- **Laptops**: Adaptación automática con tamaños intermedios
- **Tablets**: Podio vertical con elementos apilados
- **Móviles**: Soporte básico para pantallas pequeñas

**Nota**: Este frontend está diseñado principalmente para mostrarse en pantallas grandes (TV, monitores, proyectores) para eventos y presentaciones.

## 🔗 API

Consume el endpoint `/api/inscritos` del backend para obtener:
- Lista de participantes
- Tiempos totales
- Puntuaciones
- Estado de descalificación