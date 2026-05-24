import { Router } from 'express'
import Availability from '../models/Availability.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = Router()

// GET /api/availability — anyone authenticated can view
router.get('/', protect, async (req, res) => {
  try {
    const docs = await Availability.find().sort({ date: 1 })
    // Return as { "2026-05-20": ["09:00", "09:30"], ... }
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

// POST /api/availability — admin adds a slot
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { date, slot } = req.body
    if (!date || !slot) {
      return res.status(400).json({ message: 'Date et créneau requis.' })
    }

    let avail = await Availability.findOne({ date })
    if (!avail) {
      avail = await Availability.create({ date, slots: [slot] })
    } else {
      if (!avail.slots.includes(slot)) {
        avail.slots.push(slot)
        avail.slots.sort()
        await avail.save()
      }
    }

    res.status(201).json(avail)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message })
  }
})

// DELETE /api/availability/:date/:slot — admin removes one slot
router.delete('/:date/:slot', protect, adminOnly, async (req, res) => {
  try {
    const { date, slot } = req.params
    const avail = await Availability.findOne({ date })
    if (!avail) {
      return res.status(404).json({ message: 'Date introuvable.' })
    }

    avail.slots = avail.slots.filter(s => s !== slot)
    if (avail.slots.length === 0) {
      await Availability.deleteOne({ _id: avail._id })
    } else {
      await avail.save()
    }

    res.json({ message: 'Créneau supprimé.' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message })
  }
})

// DELETE /api/availability/:date — admin removes all slots for a date
router.delete('/:date', protect, adminOnly, async (req, res) => {
  try {
    const { date } = req.params
    await Availability.deleteOne({ date })
    res.json({ message: 'Tous les créneaux supprimés pour cette date.' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message })
  }
})

export default router
