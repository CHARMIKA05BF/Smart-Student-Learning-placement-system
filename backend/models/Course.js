import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  content: { type: String, default: '' },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  progress: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, percentage: { type: Number, default: 0 } }],
}, { timestamps: true })

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema)
export default Course
