import { useState } from 'react'

const agentCards = [
  { 
    name: 'Perxia-QA', 
    definition: 'Agente de IA para automatización de pruebas que genera casos de prueba automáticos y se integra con Azure DevOps' 
  },
  { 
    name: 'Perxia-Dev', 
    definition: 'Extensión de VS Code que funciona como copilot corporativo entrenado con conocimiento interno de la empresa' 
  },
  { 
    name: 'Perxia-Assist', 
    definition: 'Agente de IA para gestión de conocimiento a partir de reuniones que permite hacer preguntas sobre sesiones' 
  },
  { 
    name: 'Perxia-agentic', 
    definition: 'Frontend de interacción multi-agente que integra distintos agentes en un flujo conversacional unificado' 
  },
  { 
    name: 'Perxia-Hada', 
    definition: 'Agente de IA especializado en automatización de procesos internos de Periferia' 
  },
  { 
    name: 'Perxia-Bot', 
    definition: 'Agente de IA corporativo de Periferia, un ChatGPT empresarial para la página web' 
  },
  { 
    name: 'Perxia-Eval', 
    definition: 'Agente orientado a evaluación y control de calidad de código para hackatones y desarrollos internos' 
  },
  { 
    name: 'Perxia-Cloud', 
    definition: 'Agente de automatización de infraestructura que usa plantillas para desplegar infraestructuras multi-cloud' 
  },
  { 
    name: 'Perxia-Unit', 
    definition: 'Agente de IA especializado en pruebas unitarias que detecta y genera pruebas con cobertura mínima del 85%' 
  },
]

export default function LearningCards({ onComplete }) {
  const [currentCard, setCurrentCard] = useState(0)
  const [flippedCards, setFlippedCards] = useState(new Set())

  const handleCardClick = (index) => {
    setFlippedCards(prev => new Set([...prev, index]))
  }

  const nextCard = () => {
    if (currentCard < agentCards.length - 1) {
      setCurrentCard(currentCard + 1)
    } else {
      onComplete()
    }
  }

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
    }
  }

  const currentAgent = agentCards[currentCard]
  const isFlipped = flippedCards.has(currentCard)
  const progress = ((currentCard + 1) / agentCards.length) * 100

  return (
    <div className="learning-container">
      <div className="card">
        <div className="learning-header">
          <h2 style={{ color: '#16601D' }}>Conoce los Agentes de Perxia Suite</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">{currentCard + 1} de {agentCards.length}</p>
        </div>

        <div className="card-container">
          <div 
            className={`learning-card ${isFlipped ? 'flipped' : ''}`}
            onClick={() => handleCardClick(currentCard)}
          >
            <div className="card-front">
              <div className="card-content">
                <h3>{currentAgent.name}</h3>
                <p className="card-hint">Toca para ver la definición</p>
                <div className="card-icon">🤖</div>
              </div>
            </div>
            <div className="card-back">
              <div className="card-content">
                <h3>{currentAgent.name}</h3>
                <p className="card-definition">{currentAgent.definition}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-navigation">
          <button 
            onClick={prevCard}
            disabled={currentCard === 0}
            className="btn btn-secondary"
          >
            ← Anterior
          </button>
          
          <button 
            onClick={nextCard}
            className="btn"
          >
            {currentCard === agentCards.length - 1 ? 'Comenzar Juego →' : 'Siguiente →'}
          </button>
        </div>

        <div className="learning-tips">
          <p>💡 <strong>Tip:</strong> Toca cada tarjeta para ver la definición completa antes de continuar</p>
        </div>
      </div>
    </div>
  )
}
