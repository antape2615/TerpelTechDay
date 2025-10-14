import { useState } from 'react'

export default function QuestionModal({ question, onAnswer, onClose }) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (answer.trim()) {
      setSubmitted(true)
      onAnswer(answer.trim())
    }
  }

  return (
    <div className="question-modal">
      <div className="question-content">
        <h3>¡Correcto! 🎉</h3>
        <p style={{ marginBottom: '20px', fontSize: '18px' }}>{question}</p>
        
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Tu respuesta..."
              autoFocus
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button type="submit" className="btn btn-success">
                Responder
              </button>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Saltar
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p style={{ color: '#28a745', marginBottom: '20px' }}>
              ¡Respuesta enviada! Continuando con el juego...
            </p>
            <button onClick={onClose} className="btn">
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
