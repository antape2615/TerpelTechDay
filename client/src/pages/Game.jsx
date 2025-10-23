import { useState, useEffect, useRef } from 'react'
import { gameService } from '../services/authService'
import LearningCards from '../components/LearningCards'
import FinalQuestions from '../components/FinalQuestions'

export default function Game({ playerInfo, onLogout }) {
  const [gameState, setGameState] = useState('learning') // learning, playing, finished
  const [terms, setTerms] = useState(playerInfo.terms || [])
  const [definitions, setDefinitions] = useState(playerInfo.definitions || [])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [sessionId, setSessionId] = useState(playerInfo.sessionId)
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedDefinition, setSelectedDefinition] = useState(null)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  
  // Tiempos por sección
  const [learningStartTime, setLearningStartTime] = useState(Date.now())
  const [gameStartTime, setGameStartTime] = useState(null)
  const [finalQuestionStartTime, setFinalQuestionStartTime] = useState(null)
  
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  // Datos originales para verificar matches
  const originalPairs = [
    { term: 'Perxia-QA', definition: 'Agente de IA para automatización de pruebas que genera casos de prueba automáticos y se integra con Azure DevOps' },
    { term: 'Perxia-Dev', definition: 'Extensión de VS Code que funciona como copilot corporativo entrenado con conocimiento interno de la empresa' },
    { term: 'Perxia-Assist', definition: 'Agente de IA para gestión de conocimiento a partir de reuniones que permite hacer preguntas sobre sesiones' },
    { term: 'Perxia-agentic', definition: 'Frontend de interacción multi-agente que integra distintos agentes en un flujo conversacional unificado' },
    { term: 'Perxia-Hada', definition: 'Agente de IA especializado en automatización de procesos internos de Periferia' },
    { term: 'Perxia-Bot', definition: 'Agente de IA corporativo de Periferia, un ChatGPT empresarial para la página web' },
    { term: 'Perxia-Eval', definition: 'Agente orientado a evaluación y control de calidad de código para hackatones y desarrollos internos' },
    { term: 'Perxia-Cloud', definition: 'Agente de automatización de infraestructura que usa plantillas para desplegar infraestructuras multi-cloud' },
    { term: 'Perxia-Unit', definition: 'Agente de IA especializado en pruebas unitarias que detecta y genera pruebas con cobertura mínima del 85%' },
  ]

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setMatchedPairs([])
    setTimeElapsed(0)
    
    setGameStartTime(Date.now())
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setTimeElapsed(Date.now() - startTimeRef.current)
    }, 100)
  }

  const checkMatch = (term, definition) => {
    const pair = originalPairs.find(p => p.term === term && p.definition === definition)
    return !!pair
  }

  const handleItemClick = (item, type) => {
    if (type === 'term') {
      if (selectedTerm === item) {
        setSelectedTerm(null)
      } else {
        setSelectedTerm(item)
        // Si ya hay una definición seleccionada, hacer match automático
        if (selectedDefinition) {
          handleAutoMatch(item, selectedDefinition)
        }
      }
    } else {
      if (selectedDefinition === item) {
        setSelectedDefinition(null)
      } else {
        setSelectedDefinition(item)
        // Si ya hay un término seleccionado, hacer match automático
        if (selectedTerm) {
          handleAutoMatch(selectedTerm, item)
        }
      }
    }
  }

  const handleAutoMatch = async (term, definition) => {
    const isCorrect = checkMatch(term, definition)
    const matchTime = Date.now() - startTimeRef.current

    // Registrar match en el servidor
    try {
      await gameService.submitMatch(sessionId, term, definition, isCorrect, matchTime)
    } catch (error) {
      console.error('Error submitting match:', error)
    }

    if (isCorrect) {
      // Mostrar animación de éxito
      setShowSuccessAnimation(true)
      
      setTimeout(() => {
        setMatchedPairs(prev => [...prev, { term: term, definition: definition }])
        setScore(prev => prev + 1)
        
        // Remover items de las listas
        setTerms(prev => prev.filter(t => t !== term))
        setDefinitions(prev => prev.filter(d => d !== definition))
        
        // NO mostrar pregunta intermedia, continuar con el juego
        
        setShowSuccessAnimation(false)
      }, 800) // Mostrar verde por 0.8 segundos (más rápido)
    } else {
      // Mostrar feedback de error
      alert('❌ Incorrecto. Intenta de nuevo.')
    }

    setSelectedTerm(null)
    setSelectedDefinition(null)

    // Verificar si el juego terminó
    if (terms.length <= 1 && definitions.length <= 1) {
      // Cuando se complete el último match, ir directamente a la pregunta final
      console.log('🎯 Todos los matches completados, yendo a pregunta final...')
      setTimeout(() => {
        setFinalQuestionStartTime(Date.now())
        setGameState('finished')
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }, 2000) // Esperar 2 segundos después del último match
    }
  }

  const handleQuestionAnswer = async (answer) => {
    const questionTime = Date.now() - startTimeRef.current
    
    try {
      const response = await gameService.answerQuestion(
        sessionId, 
        currentQuestion.question, 
        answer, 
        questionTime
      )
      
      setCurrentQuestion(null)
    } catch (error) {
      console.error('Error answering question:', error)
      setCurrentQuestion(null)
    }
  }

  const finishGame = async () => {
    // Solo permitir terminar si se completaron todos los matches
    if (score === originalPairs.length) {
      setFinalQuestionStartTime(Date.now())
      setGameState('finished')
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    } else {
      // Si no completó todos los matches, marcarlo como descalificado
      // Usar solo el tiempo del juego de unir palabras
      const gameTime = timeElapsed
      
      try {
        await gameService.finishGame(
          sessionId, 
          gameTime,
          0, // learningTime - no necesario
          0, // gameTime - no necesario  
          0, // finalQuestionTime - no necesario
          score,
          false, // finalQuestionCorrect = false (descalificado)
          true // isDisqualified = true
        )
        console.log('✅ Jugador descalificado por terminar prematuramente')
      } catch (error) {
        console.error('Error saving disqualified data:', error)
      }
      
      setGameState('completed')
      alert('⚠️ Has terminado el juego prematuramente. Quedas descalificado.')
    }
  }

  const handleFinalQuestionsComplete = async (finalQuestionCorrect = false) => {
    // Usar solo el tiempo del juego de unir palabras (timeElapsed)
    // NO incluir tiempo de tarjetas de aprendizaje ni pregunta final
    const gameTime = timeElapsed
    
    try {
      await gameService.finishGame(
        sessionId, 
        gameTime,
        0, // learningTime - no necesario
        0, // gameTime - no necesario  
        0, // finalQuestionTime - no necesario
        score,
        finalQuestionCorrect
      )
      console.log('✅ Datos guardados en BD - UNA SOLA VEZ')
    } catch (error) {
      console.error('Error saving complete data:', error)
    }
    
    setGameState('completed')
  }

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const resetGame = () => {
    onLogout()
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#16601D' }}>Perxia Suite - Juego de Unir Palabras</h1>
          <div>
            <span style={{ marginRight: '20px' }}>Hola, {playerInfo?.name}</span>
          </div>
        </div>


        {gameState === 'learning' && (
          <LearningCards onComplete={startGame} />
        )}

        {gameState === 'playing' && (
          <>
            <div className="timer">
              Tiempo: {formatTime(timeElapsed)}
            </div>
            <div className="score">
              Puntuación: {score} / {originalPairs.length}
            </div>

            <div className="game-grid">
              <div className="game-column">
                <h3>Agentes de IA</h3>
                {terms.map((term, index) => {
                  const isMatched = matchedPairs.some(p => p.term === term)
                  const isSelected = selectedTerm === term
                  const isShowingSuccess = showSuccessAnimation && isSelected && selectedDefinition
                  return (
                    <div
                      key={`term-${index}`}
                      className={`game-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${isShowingSuccess ? 'success-animation' : ''}`}
                      onClick={() => !isMatched && handleItemClick(term, 'term')}
                      style={{ 
                        display: isMatched ? 'none' : 'block',
                        cursor: isMatched ? 'default' : 'pointer'
                      }}
                    >
                      {term}
                    </div>
                  )
                })}
              </div>

              <div className="game-column">
                <h3>Definiciones</h3>
                {definitions.map((definition, index) => {
                  const isMatched = matchedPairs.some(p => p.definition === definition)
                  const isSelected = selectedDefinition === definition
                  const isShowingSuccess = showSuccessAnimation && isSelected && selectedTerm
                  return (
                    <div
                      key={`def-${index}`}
                      className={`game-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${isShowingSuccess ? 'success-animation' : ''}`}
                      onClick={() => !isMatched && handleItemClick(definition, 'definition')}
                      style={{ 
                        display: isMatched ? 'none' : 'block',
                        cursor: isMatched ? 'default' : 'pointer'
                      }}
                    >
                      {definition}
                    </div>
                  )
                })}
              </div>
            </div>

            {(selectedTerm || selectedDefinition) && (
              <div className="match-controls">
                <div className="selected-items">
                  {selectedTerm && <div className="selected-item">Agente: {selectedTerm}</div>}
                  {selectedDefinition && <div className="selected-item">Definición: {selectedDefinition}</div>}
                  {selectedTerm && selectedDefinition && (
                    <div className="selected-item" style={{ color: '#667eea', fontWeight: 'bold' }}>
                      Selecciona otro elemento para formar un par automático
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedTerm(null)
                    setSelectedDefinition(null)
                  }}
                  className="btn btn-secondary"
                >
                  Limpiar Selección
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {score === originalPairs.length && (
                <div style={{ padding: '20px', background: '#d4edda', borderRadius: '8px', marginBottom: '20px' }}>
                  <h3 style={{ color: '#155724', margin: '0 0 10px 0' }}>🎉 ¡Todos los matches completados!</h3>
                  <p style={{ color: '#155724', margin: '0' }}>Ahora responderás la pregunta final según tu cargo</p>
                </div>
              )}
            </div>
          </>
        )}

        {gameState === 'finished' && (
          <FinalQuestions 
            playerPosition={playerInfo.position}
            sessionId={sessionId}
            onComplete={(correct) => handleFinalQuestionsComplete(correct)}
          />
        )}

        {gameState === 'completed' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #00FF88 0%, #1a5f3f 100%)', 
              color: 'white', 
              padding: '30px', 
              borderRadius: '15px',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '2.5rem' }}>🎉 ¡Juego Completado!</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>📊 Puntuación</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {score} / {originalPairs.length}
                  </div>
                  <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                    {Math.round((score / originalPairs.length) * 100)}% de aciertos
                  </div>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>⏱️ Tiempo Total</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {formatTime(timeElapsed)}
                  </div>
                  <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                    Promedio: {Math.round(timeElapsed / originalPairs.length / 1000)}s por match
                  </div>
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>👤 Información del Jugador</h3>
                <div style={{ fontSize: '1.1rem' }}>
                  <strong>{playerInfo.name}</strong><br/>
                  {playerInfo.position} • {playerInfo.email}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={resetGame} className="btn" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
                🎮 Nuevo Jugador
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
