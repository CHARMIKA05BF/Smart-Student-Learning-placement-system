import express from 'express'
import Assignment from '../models/Assignment.js'
import Course from '../models/Course.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('trainer', 'admin'), async (req, res) => {
  const { title, description, courseId, dueDate } = req.body
  if (!title || !description || !courseId) {
    return res.status(400).json({ message: 'Title, description, and course are required' })
  }

  const course = await Course.findById(courseId)
  if (!course) return res.status(404).json({ message: 'Course not found' })

  const assignment = await Assignment.create({ title, description, course: courseId, dueDate })
  res.status(201).json(assignment)
})

router.get('/', protect, async (req, res) => {
  const query = req.user.role === 'student' ? { 'submissions.student': req.user._id } : {}
  const assignments = await Assignment.find(query).populate('course', 'title')
  res.json(assignments)
})

router.post('/:id/submit', protect, authorizeRoles('student'), async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })

  const { answer } = req.body
  const existing = assignment.submissions.find((item) => item.student.equals(req.user._id))
  if (existing) {
    existing.answer = answer
    existing.submittedAt = new Date()
  } else {
    assignment.submissions.push({ student: req.user._id, answer })
  }

  await assignment.save()
  res.json(assignment)
})

router.post('/:id/grade', protect, authorizeRoles('trainer', 'admin'), async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })

  const { studentId, grade, feedback } = req.body
  const submission = assignment.submissions.find((item) => item.student.equals(studentId))
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' })
  }

  submission.grade = grade
  submission.feedback = feedback || submission.feedback
  await assignment.save()

  res.json(assignment)
})

export default router
