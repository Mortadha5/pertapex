import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import User from './models/User.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env') })

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connecté')

    // Clear existing users
    await User.deleteMany({})
    console.log('🗑️  Users supprimés')

    // Create admin
    await User.create({
      name: 'Administrateur',
      email: 'admin@partapex.com',
      password: 'admin123',
      role: 'admin',
    })
    console.log('👤 Admin créé: admin@partapex.com / admin123')

    // Create client
    await User.create({
      name: 'Client',
      email: 'client@partapex.com',
      password: 'client123',
      role: 'client',
    })
    console.log('👤 Client créé: client@partapex.com / client123')

    console.log('\n✅ Seed terminé !')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

seed()
