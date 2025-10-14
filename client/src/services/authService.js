import axios from 'axios'

const API_BASE_URL = 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const gameService = {
  submitMatch: (sessionId, term, definition, correct, timeMs) => 
    api.post('/game/match', { sessionId, term, definition, correct, timeMs }),
  answerQuestion: (sessionId, question, answer, timeMs) =>
    api.post('/game/answer', { sessionId, question, answer, timeMs }),
  finishGame: (sessionId, totalTimeMs, learningTimeMs, gameTimeMs, finalQuestionTimeMs, finalScore, finalQuestionCorrect) =>
    api.post('/game/finish', { 
      sessionId, 
      totalTimeMs, 
      learningTimeMs, 
      gameTimeMs, 
      finalQuestionTimeMs, 
      finalScore, 
      finalQuestionCorrect 
    })
}

export const inscritosService = {
  create: (data) => api.post('/inscritos', data),
  list: () => api.get('/inscritos')
}
