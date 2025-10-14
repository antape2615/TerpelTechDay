import { useState } from 'react'
import { gameService } from '../services/authService'

const questionsByPosition = {
  'Desarrollador': {
    question: 'Si creas un proyecto en Angular que aún no es tu lenguaje más fuerte, ¿qué agentes Perxia utilizarías?',
    options: ['Perxia-Dev', 'Perxia-Unit', 'Perxia-QA', 'Perxia-Cloud'],
    correctAnswers: ['Perxia-Dev', 'Perxia-Unit'],
    explanation: 'Perxia-Dev te ayudaría con el código y Perxia-Unit generaría las pruebas unitarias para asegurar la calidad.'
  },
  'Analista': {
    question: 'Para analizar y documentar un nuevo proceso de negocio, ¿qué agentes Perxia te serían más útiles?',
    options: ['Perxia-Assist', 'Perxia-Eval', 'Perxia-Bot', 'Perxia-agentic'],
    correctAnswers: ['Perxia-Assist', 'Perxia-agentic'],
    explanation: 'Perxia-Assist te ayudaría a gestionar el conocimiento del proceso y Perxia-agentic te permitiría interactuar con múltiples agentes para el análisis.'
  },
  'QA': {
    question: 'Para automatizar las pruebas de un nuevo módulo de la aplicación, ¿qué agentes Perxia implementarías?',
    options: ['Perxia-QA', 'Perxia-Unit', 'Perxia-Dev', 'Perxia-Eval'],
    correctAnswers: ['Perxia-QA'],
    explanation: 'Perxia-QA automatizaría las pruebas funcionales tanto en su parte de IA como su automatización.'
  },
  'PO': {
    question: 'Como Product Owner, necesitas recopilar feedback de usuarios y documentar requerimientos, ¿qué agentes usarías?',
    options: ['Perxia-Assist', 'Perxia-Bot', 'Perxia-agentic', 'Perxia-Hada'],
    correctAnswers: ['Perxia-Assist', 'Perxia-Bot'],
    explanation: 'Perxia-Assist gestionaría el conocimiento de reuniones y feedback, mientras que Perxia-Bot interactuaría directamente con los usuarios.'
  },
  'Líder Técnico': {
    question: 'Para liderar un equipo de desarrollo y asegurar la calidad del código, ¿qué agentes Perxia implementarías?',
    options: ['Perxia-Eval', 'Perxia-Dev', 'Perxia-Unit', 'Perxia-Cloud'],
    correctAnswers: ['Perxia-Eval', 'Perxia-Dev'],
    explanation: 'Perxia-Eval evaluaría la calidad del código del equipo y Perxia-Dev ayudaría a estandarizar las prácticas de desarrollo.'
  },
  'Arquitecto': {
    question: 'Para diseñar una arquitectura escalable y desplegarla en múltiples nubes, ¿qué agentes Perxia utilizarías?',
    options: ['Perxia-Cloud', 'Perxia-agentic', 'Perxia-Eval', 'Perxia-Hada'],
    correctAnswers: ['Perxia-Cloud', 'Perxia-agentic'],
    explanation: 'Perxia-Cloud automatizaría el despliegue en múltiples nubes y Perxia-agentic coordinaría los diferentes componentes de la arquitectura.'
  },
  'Scrum Master': {
    question: 'Para facilitar ceremonias ágiles y gestionar el conocimiento del equipo, ¿qué agentes Perxia implementarías?',
    options: ['Perxia-Assist', 'Perxia-agentic', 'Perxia-Hada', 'Perxia-Bot'],
    correctAnswers: ['Perxia-Assist', 'Perxia-agentic'],
    explanation: 'Perxia-Assist gestionaría el conocimiento de las ceremonias y Perxia-agentic facilitaría la coordinación entre diferentes roles del equipo.'
  }
}

export default function FinalQuestions({ playerPosition, sessionId, onComplete }) {
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const questionData = questionsByPosition[playerPosition] || questionsByPosition['Desarrollador']

  const handleAnswerToggle = (option) => {
    if (submitted) return
    
    setSelectedAnswers(prev => {
      if (prev.includes(option)) {
        return prev.filter(answer => answer !== option)
      } else {
        return [...prev, option]
      }
    })
  }

  const handleSubmit = async () => {
    if (selectedAnswers.length === 0) {
      alert('Por favor selecciona al menos una opción')
      return
    }

    setLoading(true)
    
    try {
      // Verificar respuestas
      const correctAnswers = questionData.correctAnswers
      const isCorrect = correctAnswers.every(answer => selectedAnswers.includes(answer)) && 
                       selectedAnswers.length === correctAnswers.length

      // Enviar respuesta al servidor
      await gameService.answerQuestion(
        sessionId,
        questionData.question,
        selectedAnswers.join(', '),
        Date.now()
      )

      setResult({
        correct: isCorrect,
        selectedAnswers: [...selectedAnswers],
        correctAnswers: [...correctAnswers],
        explanation: questionData.explanation
      })
      setSubmitted(true)
      
      // Notificar al componente padre sobre el resultado
      onComplete(isCorrect)
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Error al enviar la respuesta')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    // onComplete ya se llamó en handleSubmit con el resultado
  }

  return (
    <div className="final-questions-container">
      <div className="card">
        <div className="final-questions-header">
          <h2>Pregunta Final</h2>
          <p className="position-badge">Para: {playerPosition}</p>
        </div>

        <div className="question-content">
          <h3>{questionData.question}</h3>
          <p className="question-hint">Puedes seleccionar múltiples opciones</p>
        </div>

        <div className="options-grid">
          {questionData.options.map((option, index) => (
            <div
              key={index}
              className={`option-card ${selectedAnswers.includes(option) ? 'selected' : ''} ${submitted ? 'disabled' : ''}`}
              onClick={() => handleAnswerToggle(option)}
            >
              <div className="option-content">
                <span className="option-text">{option}</span>
                {selectedAnswers.includes(option) && (
                  <span className="option-check">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <div className="submit-section">
            <button 
              onClick={handleSubmit}
              disabled={selectedAnswers.length === 0 || loading}
              className="btn btn-success"
            >
              {loading ? 'Enviando...' : 'Enviar Respuesta'}
            </button>
          </div>
        ) : (
          <div className="result-section">
            <div className={`result-message ${result.correct ? 'correct' : 'incorrect'}`}>
              {result.correct ? (
                <div>
                  <h3>🎉 ¡Correcto!</h3>
                  <p>Has seleccionado todas las respuestas correctas.</p>
                </div>
              ) : (
                <div>
                  <h3>❌ Incorrecto</h3>
                  <p>No todas las respuestas son correctas.</p>
                </div>
              )}
            </div>

            <div className="answer-comparison">
              <div className="answer-section">
                <h4>Tus respuestas:</h4>
                <div className="answer-list">
                  {result.selectedAnswers.map((answer, index) => (
                    <span 
                      key={index} 
                      className={`answer-item ${result.correctAnswers.includes(answer) ? 'correct' : 'incorrect'}`}
                    >
                      {answer}
                    </span>
                  ))}
                </div>
              </div>

              <div className="answer-section">
                <h4>Respuestas correctas:</h4>
                <div className="answer-list">
                  {result.correctAnswers.map((answer, index) => (
                    <span key={index} className="answer-item correct">
                      {answer}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="explanation">
              <h4>💡 Explicación:</h4>
              <p>{result.explanation}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => onComplete(result.correct)} className="btn">
                Ver Resultados Finales
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
