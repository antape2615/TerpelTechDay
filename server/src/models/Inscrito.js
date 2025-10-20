const mongoose = require('mongoose');

const InscritoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    positionOfficial: { type: String, trim: true },
    empresa: { type: String, required: true, trim: true },
    acceptTerms: { type: Boolean, default: true },
    disqualified: { type: Boolean, default: false },
    totalTimeMs: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'inscritos' }
);

module.exports = mongoose.model('Inscrito', InscritoSchema);