import { useState } from 'react'

export default function PlayerForm({ onPlayerSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validar campos requeridos
    if (!formData.name || !formData.email || !formData.phone || !formData.position) {
      setError('Todos los campos son requeridos')
      setLoading(false)
      return
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido')
      setLoading(false)
      return
    }

    try {
      console.log('🚀 Enviando datos del jugador:', formData)
      
      // Enviar datos al backend para iniciar el juego
      const response = await fetch('https://terpeltechday.onrender.com/api/game/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error del servidor:', errorText)
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const gameData = await response.json()
      console.log('✅ Datos del juego recibidos:', gameData)
      
      // Pasar la información del jugador y los datos del juego
      onPlayerSubmit({
        ...formData,
        sessionId: gameData.sessionId,
        terms: gameData.terms,
        definitions: gameData.definitions,
        questionsCount: gameData.questionsCount
      })
    } catch (err) {
      console.error('💥 Error completo:', err)
      setError(`Error al iniciar el juego: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-container">
      <h1>Perxia Suite</h1>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#00FF88', fontSize: '24px' }}>
          ¡Bienvenido al Juego de Perxia Suite!
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '25px', color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
          Completa tus datos para comenzar a jugar y aprender sobre nuestros agentes de IA
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre completo *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Número de celular *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+57 300 123 4567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Cargo o posición *</label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu cargo</option>
              <option value="Desarrollador">Desarrollador</option>
              <option value="Analista">Analista</option>
            </select>
          </div>

          {error && <div className="error">{error}</div>}

          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Iniciando juego...' : 'Comenzar a Jugar'}
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ color: '#00FF88', marginBottom: '10px' }}>¿Cómo jugar?</h4>
          <ul style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
            <li>Toca un agente de IA y luego su definición correcta</li>
            <li>Haz clic en "Unir Selección" para verificar</li>
            <li>Cuando aciertes, responderás una pregunta adicional</li>
            <li>El juego registra tu tiempo y puntuación</li>
            <li>¡Diviértete aprendiendo sobre Perxia Suite!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
