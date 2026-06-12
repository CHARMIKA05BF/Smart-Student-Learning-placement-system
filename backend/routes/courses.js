import express from 'express'
import Course from '../models/Course.js'
import User from '../models/User.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('admin', 'trainer'), async (req, res) => {
  const { title, description, content } = req.body
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' })
  }

  const course = await Course.create({
    title,
    description,
    content,
    trainer: req.user._id,
  })
  res.status(201).json(course)
})

router.get('/', protect, async (req, res) => {
  const courses = await Course.find().populate('trainer', 'name email')
  res.json(courses)
})

router.post('/:id/enroll', protect, authorizeRoles('student'), async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course) return res.status(404).json({ message: 'Course not found' })

  course.students.addToSet(req.user._id)
  await course.save()

  req.user.enrolledCourses.addToSet(course._id)
  await req.user.save()

  res.json({ message: 'Enrolled successfully', course })
})

router.get('/:id', protect, async (req, res) => {
  const course = await Course.findById(req.params.id).populate('trainer', 'name email')
  if (!course) return res.status(404).json({ message: 'Course not found' })
  res.json(course)
})

export default router
