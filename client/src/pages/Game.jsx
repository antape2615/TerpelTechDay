import { useState, useEffect, useRef } from 'react'
import { gameService } from '../services/authService'
import QuestionModal from '../components/QuestionModal'
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
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedDefinition, setSelectedDefinition] = useState(null)
  
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
        setSelectedDefinition(null)
      }
    } else {
      if (selectedDefinition === item) {
        setSelectedDefinition(null)
      } else {
        setSelectedDefinition(item)
        setSelectedTerm(null)
      }
    }
  }

  const handleMatch = async () => {
    if (!selectedTerm || !selectedDefinition) return

    const isCorrect = checkMatch(selectedTerm, selectedDefinition)
    const matchTime = Date.now() - startTimeRef.current

    // Registrar match en el servidor
    try {
      await gameService.submitMatch(sessionId, selectedTerm, selectedDefinition, isCorrect, matchTime)
    } catch (error) {
      console.error('Error submitting match:', error)
    }

    if (isCorrect) {
      setMatchedPairs(prev => [...prev, { term: selectedTerm, definition: selectedDefinition }])
      setScore(prev => prev + 1)
      
      // Remover items de las listas
      setTerms(prev => prev.filter(t => t !== selectedTerm))
      setDefinitions(prev => prev.filter(d => d !== selectedDefinition))
      
      // Mostrar pregunta
      setCurrentQuestion({
        question: `¿Qué agente corresponde a "${selectedTerm}"?`,
        correctAnswer: selectedTerm
      })
    } else {
      // Mostrar feedback de error
      alert('❌ Incorrecto. Intenta de nuevo.')
    }

    setSelectedTerm(null)
    setSelectedDefinition(null)

    // Verificar si el juego terminó
    if (terms.length <= 1 && definitions.length <= 1) {
      finishGame()
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
    const totalTime = Date.now() - startTimeRef.current
    
    try {
      await gameService.finishGame(sessionId, totalTime)
    } catch (error) {
      console.error('Error finishing game:', error)
    }
    
    setFinalQuestionStartTime(Date.now())
    setGameState('finished')
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const handleFinalQuestionsComplete = async (finalQuestionCorrect = false) => {
    // Calcular todos los tiempos
    const learningTime = gameStartTime ? gameStartTime - learningStartTime : 0
    const gameTime = finalQuestionStartTime ? finalQuestionStartTime - gameStartTime : 0
    const finalQuestionTime = Date.now() - (finalQuestionStartTime || Date.now())
    const totalTime = Date.now() - learningStartTime
    
    try {
      await gameService.finishGame(
        sessionId, 
        totalTime,
        learningTime,
        gameTime,
        finalQuestionTime,
        score,
        finalQuestionCorrect
      )
      console.log('✅ Datos completos guardados en BD')
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
          <h1>Perxia Suite - Juego de Unir Palabras</h1>
          <div>
            <span style={{ marginRight: '20px' }}>Hola, {playerInfo?.name}</span>
            <button onClick={onLogout} className="btn btn-secondary">Nuevo Jugador</button>
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
                {terms.map((term, index) => (
                  <div
                    key={`term-${index}`}
                    className={`game-item ${matchedPairs.some(p => p.term === term) ? 'matched' : ''} ${selectedTerm === term ? 'selected' : ''}`}
                    onClick={() => handleItemClick(term, 'term')}
                  >
                    {term}
                  </div>
                ))}
              </div>

              <div className="game-column">
                <h3>Definiciones</h3>
                {definitions.map((definition, index) => (
                  <div
                    key={`def-${index}`}
                    className={`game-item ${matchedPairs.some(p => p.definition === definition) ? 'matched' : ''} ${selectedDefinition === definition ? 'selected' : ''}`}
                    onClick={() => handleItemClick(definition, 'definition')}
                  >
                    {definition}
                  </div>
                ))}
              </div>
            </div>

            {(selectedTerm || selectedDefinition) && (
              <div className="match-controls">
                <div className="selected-items">
                  {selectedTerm && <div className="selected-item">Término: {selectedTerm}</div>}
                  {selectedDefinition && <div className="selected-item">Definición: {selectedDefinition}</div>}
                </div>
                <button 
                  onClick={handleMatch}
                  disabled={!selectedTerm || !selectedDefinition}
                  className="btn btn-success"
                >
                  Unir Selección
                </button>
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
              <button onClick={finishGame} className="btn btn-danger">
                Terminar Juego
              </button>
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
          <div style={{ textAlign: 'center' }}>
            <h2>¡Juego Completado!</h2>
            <div className="score">
              Puntuación Final: {score} / {originalPairs.length}
            </div>
            <div className="timer">
              Tiempo Total: {formatTime(timeElapsed)}
            </div>
            <button onClick={resetGame} className="btn">
              Nuevo Jugador
            </button>
          </div>
        )}
      </div>

      {currentQuestion && (
        <QuestionModal
          question={currentQuestion.question}
          onAnswer={handleQuestionAnswer}
          onClose={() => setCurrentQuestion(null)}
        />
      )}
    </div>
  )
}
