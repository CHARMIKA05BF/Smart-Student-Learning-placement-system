import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  dueDate: { type: Date },
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answer: { type: String },
      submittedAt: { type: Date, default: Date.now },
      grade: { type: Number, default: 0 },
      feedback: { type: String, default: '' },
    },
  ],
}, { timestamps: true })

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema)
export default Assignment
