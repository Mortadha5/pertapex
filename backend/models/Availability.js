import mongoose from 'mongoose'

const availabilitySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  slots: {
    type: [String],
    default: [],
  },
})

export default mongoose.model('Availability', availabilitySchema)
