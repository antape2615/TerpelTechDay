import { useState } from 'react'

export default function PlayerForm({ onPlayerSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    positionOfficial: '',
    empresa: '',
    acceptTerms: true
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validar campos requeridos
    if (!formData.name || !formData.email || !formData.phone || !formData.position || !formData.empresa) {
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
      const response = await fetch(' http://localhost:4000/api/game/start', {
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
      // Usar el cargo oficial si está disponible, sino usar el cargo del selector
      const finalPosition = formData.positionOfficial.trim() || formData.position
      
      onPlayerSubmit({
        ...formData,
        position: finalPosition, // Usar el cargo final (oficial o del selector)
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
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleFocus = (e) => {
    e.target.style.borderColor = '#00FF88'
  }

  const handleBlur = (e) => {
    e.target.style.borderColor = '#e1e5e9'
  }

  return (
    <div className="auth-container">
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <img 
          src="/LogoCompleto.png" 
          alt="Logo Periferia IT GROUP" 
          style={{ 
            maxWidth: '250px', 
            height: 'auto',
            marginBottom: '10px'
          }} 
        />
      </div>
      <h1 style={{ color: '#16601D' }}>Perxia Suite</h1>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#16601D', fontSize: '24px' }}>
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
            <label htmlFor="empresa">Empresa *</label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              required
              placeholder="Nombre de tu empresa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Cargo o posición *</label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '25px',
                fontSize: '16px',
                backgroundColor: 'white',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
                paddingRight: '40px'
              }}
            >
              <option value="">Selecciona tu cargo</option>
              <option value="Desarrollador">Desarrollador</option>
              <option value="Analista">Analista</option>
              <option value="QA">QA</option>
              <option value="Product Owner">Product Owner</option>
              <option value="DevOps">DevOps</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="BD">BD (Base de Datos)</option>
              <option value="Diseñador UX">Diseñador UX</option>
              <option value="Ingeniero de Seguridad">Ingeniero de Seguridad</option>
              <option value="Customer Manager">Customer Manager</option>
              <option value="Community Manager">Community Manager</option>
              <option value="Ingeniero de Soporte">Ingeniero de Soporte</option>
              <option value="Reclutador">Reclutador</option>
              <option value="Documentador de Procesos">Documentador de Procesos</option>
              <option value="Líder Técnico">Líder Técnico</option>
              <option value="Arquitecto">Arquitecto</option>
              <option value="Scrum Master">Scrum Master</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Comercial">Comercial</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="positionOfficial">Nombre oficial del cargo</label>
            <input
              type="text"
              id="positionOfficial"
              name="positionOfficial"
              value={formData.positionOfficial}
              onChange={handleChange}
              placeholder="Ej: Senior Frontend Developer, Business Analyst, etc."
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Escribe el nombre de tu cargo oficial
            </small>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                style={{ 
                  marginRight: '10px', 
                  marginTop: '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  accentColor: '#16601D',
                  cursor: 'pointer'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '5px' }}>
                  ¿Aceptas recibir información de Periferia IT Group a través de los datos que has registrado?
                </div>
                <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                  (Marcando esta opción autorizas a Periferia a enviarte información relacionada a través de los medios proporcionados.)
                </div>
              </div>
            </label>
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
          <h4 style={{ color: '#667eea', marginBottom: '10px' }}>¿Cómo jugar?</h4>
              <ul style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                <li>Selecciona un agente de IA en la primera columna.</li>
                <li>Luego, elige su definición correcta en la segunda columna.</li>
                <li>El match se realiza automáticamente al seleccionar una opción de cada columna.</li>
                <li>Continúa hasta completar los 9 matches.</li>
                <li>Al final responderás una pregunta según tu cargo.</li>
                <li>El juego registra tu tiempo y puntuación</li>
                <li>¡Diviértete aprendiendo sobre Perxia Suite!</li>
              </ul>
        </div>
      </div>
    </div>
  )
}
