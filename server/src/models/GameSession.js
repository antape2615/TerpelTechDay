const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema(
  {
    term: String,
    definition: String,
    correct: Boolean,
    timeMs: Number,
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    correct: Boolean,
    timeMs: Number,
  },
  { _id: false }
);

const GameSessionSchema = new mongoose.Schema(
  {
    playerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      position: { type: String, required: true },
      positionOfficial: { type: String },
      empresa: { type: String, required: true },
      acceptTerms: { type: Boolean, default: true }
    },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    totalTimeMs: { type: Number, default: 0 },
    learningTimeMs: { type: Number, default: 0 }, // Tiempo en tarjetas de aprendizaje
    gameTimeMs: { type: Number, default: 0 }, // Tiempo en el juego de unir
    finalQuestionTimeMs: { type: Number, default: 0 }, // Tiempo en pregunta final
    finalScore: { type: Number, default: 0 },
    finalQuestionCorrect: { type: Boolean, default: false },
    matches: [MatchSchema],
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('GameSession', GameSessionSchema);
