const express = require('express');
const GameSession = require('../models/GameSession');
const { pairs, questions } = require('../data/perxia');

const router = express.Router();

// Iniciar sesión de juego
router.post('/start', async (req, res) => {
  try {
    console.log('🎮 Iniciando juego - Datos recibidos:', req.body);
    console.log('🔍 Campos específicos:', {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      position: req.body.position,
      positionOfficial: req.body.positionOfficial,
      empresa: req.body.empresa,
      acceptTerms: req.body.acceptTerms
    });
    
    const { name, email, phone, position, positionOfficial, empresa, acceptTerms } = req.body;
    
    // Validar datos
    if (!name || !email || !phone || !position || !empresa) {
      console.log('❌ Datos incompletos:', { name: !!name, email: !!email, phone: !!phone, position: !!position, empresa: !!empresa });
      return res.status(400).json({ error: 'Datos del jugador requeridos' });
    }
    
    console.log('✅ Datos válidos, creando sesión...');
    
    const session = await GameSession.create({ 
      playerInfo: { name, email, phone, position, positionOfficial, empresa, acceptTerms },
      startedAt: new Date() 
    });
    
    console.log('✅ Sesión creada con ID:', session._id);
    
    // Barajar términos y definiciones por separado
    const shuffledTerms = [...pairs].sort(() => Math.random() - 0.5).map(p => p.term);
    const shuffledDefs = [...pairs].sort(() => Math.random() - 0.5).map(p => p.definition);
    
    const response = { 
      sessionId: session._id, 
      terms: shuffledTerms, 
      definitions: shuffledDefs, 
      questionsCount: questions.length 
    };
    
    console.log('🎯 Enviando respuesta:', {
      sessionId: response.sessionId,
      termsCount: response.terms.length,
      definitionsCount: response.definitions.length,
      questionsCount: response.questionsCount
    });
    
    res.json(response);
  } catch (error) {
    console.error('💥 Error en /game/start:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});

// Registrar un match (correcto o incorrecto)
router.post('/match', async (req, res) => {
  const { sessionId, term, definition, correct, timeMs } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId requerido' });
  const session = await GameSession.findById(sessionId);
  if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
  session.matches.push({ term, definition, correct: !!correct, timeMs: Number(timeMs) || 0 });
  await session.save();
  // Si fue correcto, devolver una pregunta
  let question = null;
  if (correct) {
    const idx = session.questions.length % questions.length;
    question = { question: questions[idx].q };
  }
  res.json({ ok: true, question });
});

// Marcar como descalificado por saltar match
router.post('/skip-match', async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId requerido' });
  
  const session = await GameSession.findById(sessionId);
  if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
  
  // Marcar como descalificado
  session.disqualified = true;
  session.skippedMatches += 1;
  await session.save();
  
  console.log('❌ Usuario descalificado por saltar match:', session.playerInfo.name);
  
  res.json({ 
    ok: true, 
    disqualified: true, 
    message: 'Has sido descalificado por saltar un match' 
  });
});

// Responder pregunta
router.post('/answer', async (req, res) => {
  const { sessionId, question, answer, timeMs } = req.body;
  const session = await GameSession.findById(sessionId);
  if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
  const q = questions.find((q) => q.q === question);
  const correct = q ? q.a === answer : false;
  session.questions.push({ question, answer, correct, timeMs: Number(timeMs) || 0 });
  await session.save();
  res.json({ correct });
});

// Finalizar sesión con tiempo total
router.post('/finish', async (req, res) => {
  const { sessionId, totalTimeMs, learningTimeMs, gameTimeMs, finalQuestionTimeMs, finalScore, finalQuestionCorrect } = req.body;
  const session = await GameSession.findById(sessionId);
  if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
  
  // Solo guardar en inscritos, no en GameSession
  try {
    const Inscrito = require('../models/Inscrito');
    
    console.log('💾 Datos a guardar en inscritos:', {
      name: session.playerInfo.name,
      email: session.playerInfo.email,
      phone: session.playerInfo.phone,
      position: session.playerInfo.position,
      positionOfficial: session.playerInfo.positionOfficial,
      empresa: session.playerInfo.empresa,
      acceptTerms: session.playerInfo.acceptTerms
    });
    
    // Validar que empresa no sea undefined
    if (!session.playerInfo.empresa) {
      console.error('❌ Campo empresa es undefined:', session.playerInfo);
      return res.status(400).json({ error: 'Campo empresa es requerido' });
    }
    
    await Inscrito.create({
      name: session.playerInfo.name,
      email: session.playerInfo.email,
      phone: session.playerInfo.phone,
      position: session.playerInfo.position,
      positionOfficial: session.playerInfo.positionOfficial,
      empresa: session.playerInfo.empresa,
      acceptTerms: session.playerInfo.acceptTerms,
      disqualified: session.disqualified || false,
      totalTimeMs: Number(totalTimeMs) || 0,
      finalScore: Number(finalScore) || 0,
      completedAt: new Date()
    });
    console.log('✅ Datos guardados en inscritos para:', session.playerInfo.name);
  } catch (error) {
    console.error('❌ Error guardando en inscritos:', error);
    return res.status(500).json({ error: 'Error guardando datos' });
  }
  
  res.json({ ok: true });
});

module.exports = router;