import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || ' http://localhost:4000/api'

function App() {
  const [inscritos, setInscritos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const intervalRef = useRef(null)

  useEffect(() => {
    fetchInscritos()
    
    // Configurar polling cada 5 segundos
    intervalRef.current = setInterval(() => {
      fetchInscritos(true) // true indica que es una actualización automática
    }, 5000)

    // Cleanup del intervalo al desmontar el componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const fetchInscritos = async (isAutoUpdate = false) => {
    try {
      // Solo mostrar loading en la primera carga
      if (!isAutoUpdate) {
        setLoading(true)
      }
      
      const response = await axios.get(`${API_URL}/inscritos`)
      
      // Filtrar solo los que completaron el juego (no descalificados)
      const completados = response.data.filter(inscrito => 
        !inscrito.isDisqualified && inscrito.totalTimeMs > 0
      )
      
      // Ordenar por tiempo (menor tiempo = mejor)
      const ordenados = completados.sort((a, b) => a.totalTimeMs - b.totalTimeMs)
      
      // Tomar los 3 mejores
      const nuevosInscritos = ordenados.slice(0, 3)
      
      // Verificar si hay cambios en el podio
      const hasChanges = JSON.stringify(nuevosInscritos) !== JSON.stringify(inscritos)
      
      if (hasChanges) {
        setInscritos(nuevosInscritos)
        setLastUpdate(new Date())
        
        // Mostrar notificación de actualización si es automática
        if (isAutoUpdate) {
          showUpdateNotification()
        }
      }
      
      setError(null)
    } catch (err) {
      console.error('Error fetching inscritos:', err)
      setError('Error al cargar los resultados')
    } finally {
      if (!isAutoUpdate) {
        setLoading(false)
      }
    }
  }

  const showUpdateNotification = () => {
    // Crear notificación temporal
    const notification = document.createElement('div')
    notification.className = 'update-notification'
    notification.textContent = '🔄 Podio actualizado'
    document.body.appendChild(notification)
    
    // Remover después de 3 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 3000)
  }

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getPositionStyle = (index) => {
    const positions = [
      { 
        height: '240px', 
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        transform: 'scale(1.1)',
        zIndex: 3,
        boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)'
      },
      { 
        height: '200px', 
        background: 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)',
        transform: 'scale(1.05)',
        zIndex: 2,
        boxShadow: '0 8px 25px rgba(192, 192, 192, 0.4)'
      },
      { 
        height: '160px', 
        background: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
        transform: 'scale(1.0)',
        zIndex: 1,
        boxShadow: '0 6px 20px rgba(205, 127, 50, 0.4)'
      }
    ]
    return positions[index] || positions[2]
  }

  const getPositionIcon = (index) => {
    const icons = ['🥇', '🥈', '🥉']
    return icons[index] || '🏆'
  }

  const getPositionTitle = (index) => {
    const titles = ['1er Lugar', '2do Lugar', '3er Lugar']
    return titles[index] || 'Participante'
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Cargando resultados...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>❌ {error}</h2>
          <button onClick={fetchInscritos} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">🏆 Podio Perxia Suite</h1>
        <p className="subtitle">Los 3 mejores tiempos del juego</p>
        <div className="auto-update-indicator">
          <span className="update-icon">🔄</span>
          <span>Actualización automática cada 5 segundos</span>
          <button 
            onClick={() => fetchInscritos(false)} 
            className="manual-update-btn"
            title="Actualizar ahora"
          >
            ⚡
          </button>
        </div>
      </div>

      <div className="podium-container">
        {inscritos.length === 0 ? (
          <div className="no-results">
            <h3>📊 No hay resultados aún</h3>
            <p>Los primeros participantes aparecerán aquí</p>
          </div>
        ) : (
          <div className="podium">
            {inscritos.map((inscrito, index) => (
              <div key={inscrito.id} className="podium-item" style={getPositionStyle(index)}>
                <div className="position-icon">
                  {getPositionIcon(index)}
                </div>
                <div className="position-title">
                  {getPositionTitle(index)}
                </div>
                <div className="participant-info">
                  <h3 className="participant-name">{inscrito.name}</h3>
                  <p className="participant-position">{inscrito.position}</p>
                  <div className="time-info">
                    <span className="time-label">Tiempo:</span>
                    <span className="time-value">{formatTime(inscrito.totalTimeMs)}</span>
                  </div>
                  <div className="score-info">
                    <span className="score-label">Puntuación:</span>
                    <span className="score-value">{inscrito.finalScore}/9</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="footer">
        <p>🎮 Perxia Suite - Juego de Unir Palabras</p>
        <p>Última actualización: {lastUpdate.toLocaleString('es-ES')}</p>
      </div>
    </div>
  )
}

export default App