import { Router } from 'express'
import Request from '../models/Request.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import { analyzeRequest } from '../services/aiService.js'

const router = Router()

// POST /api/ai/analyze-request/:id — admin triggers AI analysis
router.post('/analyze-request/:id', protect, adminOnly, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
    if (!request) {
      return res.status(404).json({ message: 'Demande introuvable.' })
    }

    const analysis = await analyzeRequest(request)

    request.aiAnalysis = analysis
    await request.save()

    res.json(request)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'analyse IA.', error: error.message })
  }
})

export default router
