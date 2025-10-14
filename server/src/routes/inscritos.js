const express = require('express');
const Inscrito = require('../models/Inscrito');

const router = express.Router();

// Crear inscrito
router.post('/', async (req, res) => {
  const { name, email, company, metadata } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'name y email son requeridos' });
  const doc = await Inscrito.create({ name, email, company, metadata });
  res.status(201).json({ id: doc._id });
});

// Listar inscritos (simple, sin paginación por ahora)
router.get('/', async (_req, res) => {
  const items = await Inscrito.find().sort({ completedAt: -1 }).limit(100);
  res.json(items.map(i => ({ 
    id: i._id, 
    name: i.name, 
    email: i.email, 
    phone: i.phone,
    position: i.position,
    totalTimeMs: i.totalTimeMs,
    finalScore: i.finalScore,
    completedAt: i.completedAt 
  })));
});

module.exports = router;