const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./utils/db');

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  console.log('🏥 Health check solicitado');
  res.json({ ok: true, service: 'perxia-suite-api' });
});

// Log middleware para todas las peticiones
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, req.body);
  next();
});

// Routes
app.use('/api/game', require('./routes/game'));
app.use('/api/inscritos', require('./routes/inscritos'));

const port = process.env.PORT || 4000;

async function start() {
  await connectDb();
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});