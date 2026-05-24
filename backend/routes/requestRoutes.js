import { Router } from 'express'
import Request from '../models/Request.js'
import Availability from '../models/Availability.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = Router()

// POST /api/requests — client creates a request
router.post('/', protect, async (req, res) => {
  try {
    const { clientName, email, phone, requestType, subject, message, preferredDate, timeSlot } = req.body

    if (!clientName || !email || !phone || !requestType || !subject || !message || !preferredDate || !timeSlot) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' })
    }

    // Verify slot is still available
    const avail = await Availability.findOne({ date: preferredDate })
    if (!avail || !avail.slots.includes(timeSlot)) {
      return res.status(400).json({ message: 'Ce créneau n\'est plus disponible.' })
    }

    const request = await Request.create({
      client: req.user._id,
      clientName,
      email,
      phone,
      requestType,
      subject,
      message,
      preferredDate,
      timeSlot,
      status: 'Nouvelle',
    })

    // Remove booked slot from availability
    avail.slots = avail.slots.filter(s => s !== timeSlot)
    if (avail.slots.length === 0) {
      await Availability.deleteOne({ _id: avail._id })
    } else {
      await avail.save()
    }

    res.status(201).json(request)

    // Emit real-time event
    const io = req.app.get('io')
    io.emit('request:created', request)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message })
  }
})

// GET /api/requests — admin gets all, client gets own
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { client: req.user._id }
    const requests = await Request.find(filter).sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message })
  }
})

// PUT /api/requests/:id — admin updates status
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['Nouvelle', 'En cours', 'Terminée', 'Refusée']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' })
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!request) {
      return res.status(404).json({ message: 'Demande introuvable.' })
    }

    res.json(request)

    // Emit real-time event
    const io = req.app.get('io')
    io.emit('request:updated', request)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message })
  }
})

// DELETE /api/requests/:id — admin deletes request
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id)
    if (!request) {
      return res.status(404).json({ message: 'Demande introuvable.' })
    }
    res.json({ message: 'Demande supprimée.' })

    // Emit real-time event
    const io = req.app.get('io')
    io.emit('request:deleted', { _id: req.params.id })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message })
  }
})

export default router
