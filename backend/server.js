import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'

import authRoutes from './routes/authRoutes.js'
import requestRoutes from './routes/requestRoutes.js'
import availabilityRoutes from './routes/availabilityRoutes.js'
import aiRoutes from './routes/aiRoutes.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env') })

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' }
})
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Make io accessible to routes
app.set('io', io)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Client connecté:', socket.id)
  socket.on('disconnect', () => {
    console.log('🔌 Client déconnecté:', socket.id)
  })
})

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connecté')
    httpServer.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB:', err.message)
    process.exit(1)
  })
