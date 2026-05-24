import { Router } from 'express'
import Request from '../models/Request.js'
import Availability from '../models/Availability.js'

const router = Router()

// GET /api/public/availability — public visitors can view availability
router.get('/availability', async (req, res) => {
  try {
    const docs = await Availability.find().sort({ date: 1 })
    const result = {}
    for (const doc of docs) {
      if (doc.slots.length > 0) {
        result[doc.date] = doc.slots
      }
    }
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message })
  }
})

// POST /api/public/requests — public visitors can submit a request
router.post('/requests', async (req, res) => {
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
      clientName,
      email,
      phone,
      requestType,
      subject,
      message,
      preferredDate,
      timeSlot,
      status: 'Nouvelle',
      source: 'public',
    })

    // Remove booked slot from availability
    avail.slots = avail.slots.filter(s => s !== timeSlot)
    if (avail.slots.length === 0) {
      await Availability.deleteOne({ _id: avail._id })
    } else {
      await avail.save()
    }

    // Emit real-time event
    const io = req.app.get('io')
    io.emit('request:created', request)

    res.status(201).json({ message: 'Votre demande a été envoyée avec succès.', request })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message })
  }
})

export default router
