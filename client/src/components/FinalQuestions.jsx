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
  'Product Owner': {
    question: 'Como Product Owner, necesitas recopilar feedback de usuarios y documentar requerimientos, ¿qué agentes usarías?',
    options: ['Perxia-Assist', 'Perxia-Bot', 'Perxia-agentic', 'Perxia-Hada'],
    correctAnswers: ['Perxia-Assist', 'Perxia-Bot'],
    explanation: 'Perxia-Assist gestionaría el conocimiento de reuniones y feedback, mientras que Perxia-Bot interactuaría directamente con los usuarios.'
  },
  'DevOps': {
    question: 'Para automatizar el despliegue y monitoreo de aplicaciones en múltiples entornos, ¿qué agentes Perxia implementarías?',
    options: ['Perxia-Cloud', 'Perxia-Hada', 'Perxia-Eval', 'Perxia-agentic'],
    correctAnswers: ['Perxia-Cloud'],
    explanation: 'Perxia-Cloud automatizaría la infraestructura y despliegues'
  },
  'Data Analyst': {
    question: 'Para analizar grandes volúmenes de datos y generar insights, ¿qué agentes Perxia utilizarías?',
    options: ['Perxia-Assist', 'Perxia-Bot', 'Perxia-agentic', 'Perxia-Eval'],
    correctAnswers: ['Perxia-Assist', 'Perxia-Agentic'],
    explanation: 'Perxia-Assist procesaría y estructuraría los datos, mientras que Perxia-Agentic te conecta agentes que te generarían reportes y insights automáticamente.'
  },
  'BD': {
    question: 'Para optimizar y mantener bases de datos, ¿qué agentes Perxia implementarías?',
    options: ['Perxia-Cloud', 'Perxia-Eval', 'Perxia-Hada', 'Perxia-Unit'],
    correctAnswers: ['Perxia-Cloud', 'Perxia-Eval'],
    explanation: 'Perxia-Cloud gestionaría la infraestructura de BD y Perxia-Eval evaluaría el rendimiento y optimización.'
  },
  'Diseñador UX': {
    question: 'Para crear experiencias de usuario basadas en datos y feedback, ¿qué agentes Perxia usarías?',
    options: ['Perxia-Assist', 'Perxia-Bot', 'Perxia-agentic', 'Perxia-Hada'],
    correctAnswers: ['Perxia-Assist'],
    explanation: 'Perxia-Assist analizaría el feedback de usuarios'
  },
  'Ingeniero de Seguridad': {
    question: 'Para implementar y monitorear la seguridad de aplicaciones, ¿qué agentes Perxia utilizarías?',
    options: ['Perxia-Eval', 'Perxia-Cloud', 'Perxia-Hada', 'Perxia-agentic'],
    correctAnswers: ['Perxia-Eval', 'Perxia-Cloud'],
    explanation: 'Perxia-Eval evaluaría vulnerabilidades y Perxia-Cloud implementaría controles de seguridad en la infraestructura.'
  },
  'Customer Manager': {
    question: 'Para gestionar relaciones con clientes y mejorar la experiencia, ¿qué agentes Perxia implementarías?',
    options: ['Perxia-Bot', 'Perxia-Assist', 'Perxia-agentic', 'Perxia-Hada'],
    correctAnswers: ['Perxia-Bot', 'Perxia-Assist'],
    explanation: 'Perxia-Bot interactuaría directamente con clientes y Perxia-Assist gestionaría el conocimiento de las interacciones.'
  },
  'Community Manager': {
    question: 'Para gestionar comunidades y generar engagement, ¿qué agentes Perxia usarías?',
    options: ['Perxia-Bot', 'Perxia-Assist', 'Perxia-agentic', 'Perxia-Hada'],
    correctAnswers: ['Perxia-Bot', 'Perxia-Assist'],
    explanation: 'Perxia-Bot automatizaría respuestas y engagement, mientras que Perxia-Assist analizaría el sentimiento de la comunidad.'
  },
  'Ingeniero de Soporte': {
    question: 'Para brindar soporte técnico eficiente y escalable, ¿qué agentes Perxia implementarías?',
    options: ['Perxia-Bot', 'Perxia-Assist', 'Perxia-Hada', 'Perxia-Eval'],
    correctAnswers: ['Perxia-Bot', 'Perxia-Assist'],
    explanation: 'Perxia-Bot resolvería consultas comunes automáticamente y Perxia-Assist gestionaría el conocimiento de soluciones.'
  },
  'Reclutador': {
    question: 'Para optimizar el proceso de reclutamiento y selección, ¿qué agentes Perxia utilizarías?',
    options: ['Perxia-Assist', 'Perxia-Bot', 'Perxia-Hada', 'Perxia-agentic'],
    correctAnswers: ['Perxia-Assist', 'Perxia-Bot'],
    explanation: 'Perxia-Assist analizaría perfiles y Perxia-Bot automatizaría la comunicación inicial con candidatos.'
  },
  'Documentador de Procesos': {
    question: 'Para documentar y mantener procesos organizacionales, ¿qué agentes Perxia implementarías?',
    options: ['Perxia-Assist', 'Perxia-Hada', 'Perxia-Bot', 'Perxia-agentic'],
    correctAnswers: ['Perxia-Assist', 'Perxia-Agentic'],
    explanation: 'Perxia-Assist estructuraría y organizaría la documentación, mientras que Perxia-Agentic te conecta agentes que automatizarían la actualización de procesos.'
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
  },
  'Administrativo': {
    question: 'Para automatizar procesos administrativos y gestionar documentación empresarial, ¿qué agentes Perxia utilizarías?',
    options: ['Perxia-Hada', 'Perxia-Assist', 'Perxia-Bot', 'Perxia-agentic'],
    correctAnswers: ['Perxia-Hada', 'Perxia-Assist'],
    explanation: 'Perxia-Hada automatizaría procesos administrativos internos y Perxia-Assist gestionaría la documentación y conocimiento organizacional.'
  },
  'Comercial': {
    question: 'Para optimizar ventas y gestión comercial con clientes, ¿qué agentes Perxia implementarías?',
    options: ['Perxia-Bot', 'Perxia-Assist', 'Perxia-agentic', 'Perxia-Hada'],
    correctAnswers: ['Perxia-Bot', 'Perxia-Assist'],
    explanation: 'Perxia-Bot interactuaría directamente con clientes para ventas y Perxia-Assist gestionaría el conocimiento comercial y seguimiento de oportunidades.'
  }
}

export default function FinalQuestions({ playerPosition, sessionId, onComplete }) {
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Función para detectar el tipo de cargo basado en palabras clave
  const detectPositionType = (position) => {
    const pos = position.toLowerCase()
    
    if (pos.includes('desarrollador') || pos.includes('developer') || pos.includes('programador') || pos.includes('frontend') || pos.includes('backend') || pos.includes('fullstack')) {
      return 'Desarrollador'
    }
    if (pos.includes('analista') || pos.includes('analyst') || pos.includes('business analyst')) {
      return 'Analista'
    }
    if (pos.includes('qa') || pos.includes('tester') || pos.includes('testing') || pos.includes('quality')) {
      return 'QA'
    }
    if (pos.includes('product owner') || pos.includes('po') || pos.includes('product manager')) {
      return 'Product Owner'
    }
    if (pos.includes('devops') || pos.includes('dev ops') || pos.includes('sre') || pos.includes('site reliability')) {
      return 'DevOps'
    }
    if (pos.includes('data analyst') || pos.includes('data scientist') || pos.includes('analista de datos')) {
      return 'Data Analyst'
    }
    if (pos.includes('bd') || pos.includes('base de datos') || pos.includes('database') || pos.includes('dba')) {
      return 'BD'
    }
    if (pos.includes('diseñador') || pos.includes('designer') || pos.includes('ux') || pos.includes('ui') || pos.includes('user experience')) {
      return 'Diseñador UX'
    }
    if (pos.includes('seguridad') || pos.includes('security') || pos.includes('cybersecurity') || pos.includes('infosec')) {
      return 'Ingeniero de Seguridad'
    }
    if (pos.includes('customer') || pos.includes('cliente') || pos.includes('account manager')) {
      return 'Customer Manager'
    }
    if (pos.includes('community') || pos.includes('comunidad') || pos.includes('social media')) {
      return 'Community Manager'
    }
    if (pos.includes('soporte') || pos.includes('support') || pos.includes('helpdesk') || pos.includes('help desk')) {
      return 'Ingeniero de Soporte'
    }
    if (pos.includes('reclutador') || pos.includes('recruiter') || pos.includes('talent acquisition') || pos.includes('hr')) {
      return 'Reclutador'
    }
    if (pos.includes('documentador') || pos.includes('documentation') || pos.includes('procesos') || pos.includes('process')) {
      return 'Documentador de Procesos'
    }
    if (pos.includes('líder') || pos.includes('leader') || pos.includes('lead') || pos.includes('tech lead') || pos.includes('team lead')) {
      return 'Líder Técnico'
    }
    if (pos.includes('arquitecto') || pos.includes('architect') || pos.includes('solution architect')) {
      return 'Arquitecto'
    }
    if (pos.includes('scrum') || pos.includes('master') || pos.includes('agile coach')) {
      return 'Scrum Master'
    }
    if (pos.includes('administrativo') || pos.includes('administrative') || pos.includes('admin') || pos.includes('administración')) {
      return 'Administrativo'
    }
    if (pos.includes('comercial') || pos.includes('commercial') || pos.includes('ventas') || pos.includes('sales') || pos.includes('vendedor') || pos.includes('seller')) {
      return 'Comercial'
    }
    
    // Por defecto, usar Desarrollador
    return 'Desarrollador'
  }

  const positionType = detectPositionType(playerPosition)
  const questionData = questionsByPosition[positionType] || questionsByPosition['Desarrollador']

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
      
      // NO llamar onComplete automáticamente, esperar a que el usuario haga clic en "Ver Resultados Finales"
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
              {positionType !== playerPosition && (
                <p className="position-detected" style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                  (Pregunta adaptada para: {positionType})
                </p>
              )}
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

            <div style={{ 
              textAlign: 'center', 
              marginTop: '15px', 
              padding: '10px', 
              background: 'rgba(0, 255, 136, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 136, 0.3)'
            }}>
              <p style={{ margin: '0', color: '#1a5f3f', fontWeight: '500' }}>
                Haz clic en el botón de abajo para ver tus resultados finales
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => onComplete(result.correct)} 
                className="btn"
                style={{ 
                  padding: '12px 24px', 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: result.correct ? 'linear-gradient(135deg, #00FF88 0%, #1a5f3f 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {result.correct ? '🎉 Ver Resultados Finales' : '📊 Ver Resultados Finales'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
