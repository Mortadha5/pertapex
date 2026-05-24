import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  requestType: {
    type: String,
    required: true,
    enum: [
      'Transformation numérique',
      'Gestion administrative et commerciale',
      'Ressources humaines et paie',
      'Conseil stratégique',
      'Autre',
    ],
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  preferredDate: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Nouvelle', 'En cours', 'Terminée', 'Refusée'],
    default: 'Nouvelle',
  },
  aiAnalysis: {
    priority: String,
    category: String,
    summary: String,
    recommendedStatus: String,
    suggestedResponse: String,
    nextAction: String,
    analyzedAt: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Request', requestSchema)
