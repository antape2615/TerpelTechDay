const express = require('express');
const Inscrito = require('../models/Inscrito');

const router = express.Router();

// Crear inscrito
router.post('/', async (req, res) => {
  const { name, email, phone, position, positionOfficial, empresa, acceptTerms, disqualified, metadata } = req.body || {};
  if (!name || !email || !phone || !position || !empresa) return res.status(400).json({ error: 'name, email, phone, position y empresa son requeridos' });
  const doc = await Inscrito.create({ name, email, phone, position, positionOfficial, empresa, acceptTerms, disqualified, metadata });
  res.status(201).json({ id: doc._id });
});

// Listar inscritos (simple, sin paginación por ahora)
router.get('/', async (req, res) => {
  const { acceptTerms } = req.query;
  let query = {};
  
  // Filtrar por acceptTerms si se proporciona
  if (acceptTerms !== undefined) {
    query.acceptTerms = acceptTerms === 'true';
  }
  
  const items = await Inscrito.find(query).sort({ completedAt: -1 }).limit(100);
  res.json(items.map(i => ({ 
    id: i._id, 
    name: i.name, 
    email: i.email, 
    phone: i.phone,
    position: i.position,
    positionOfficial: i.positionOfficial,
    empresa: i.empresa,
    acceptTerms: i.acceptTerms,
    disqualified: i.disqualified,
    totalTimeMs: i.totalTimeMs,
    finalScore: i.finalScore,
    completedAt: i.completedAt 
  })));
});

// Ruta específica para obtener solo usuarios que aceptaron términos
router.get('/accepted-terms', async (_req, res) => {
  const items = await Inscrito.find({ acceptTerms: true }).sort({ completedAt: -1 }).limit(100);
  res.json(items.map(i => ({ 
    id: i._id, 
    name: i.name, 
    email: i.email, 
    phone: i.phone,
    position: i.position,
    positionOfficial: i.positionOfficial,
    empresa: i.empresa,
    acceptTerms: i.acceptTerms,
    disqualified: i.disqualified,
    totalTimeMs: i.totalTimeMs,
    finalScore: i.finalScore,
    completedAt: i.completedAt 
  })));
});

// Ruta específica para obtener solo usuarios que NO aceptaron términos
router.get('/rejected-terms', async (_req, res) => {
  const items = await Inscrito.find({ acceptTerms: false }).sort({ completedAt: -1 }).limit(100);
  res.json(items.map(i => ({ 
    id: i._id, 
    name: i.name, 
    email: i.email, 
    phone: i.phone,
    position: i.position,
    positionOfficial: i.positionOfficial,
    empresa: i.empresa,
    acceptTerms: i.acceptTerms,
    disqualified: i.disqualified,
    totalTimeMs: i.totalTimeMs,
    finalScore: i.finalScore,
    completedAt: i.completedAt 
  })));
});

// Ruta específica para obtener solo usuarios descalificados
router.get('/disqualified', async (_req, res) => {
  const items = await Inscrito.find({ disqualified: true }).sort({ completedAt: -1 }).limit(100);
  res.json(items.map(i => ({ 
    id: i._id, 
    name: i.name, 
    email: i.email, 
    phone: i.phone,
    position: i.position,
    positionOfficial: i.positionOfficial,
    empresa: i.empresa,
    acceptTerms: i.acceptTerms,
    disqualified: i.disqualified,
    totalTimeMs: i.totalTimeMs,
    finalScore: i.finalScore,
    completedAt: i.completedAt 
  })));
});

// Ruta específica para obtener solo usuarios NO descalificados
router.get('/qualified', async (_req, res) => {
  const items = await Inscrito.find({ disqualified: false }).sort({ completedAt: -1 }).limit(100);
  res.json(items.map(i => ({ 
    id: i._id, 
    name: i.name, 
    email: i.email, 
    phone: i.phone,
    position: i.position,
    positionOfficial: i.positionOfficial,
    empresa: i.empresa,
    acceptTerms: i.acceptTerms,
    disqualified: i.disqualified,
    totalTimeMs: i.totalTimeMs,
    finalScore: i.finalScore,
    completedAt: i.completedAt 
  })));
});

module.exports = router;