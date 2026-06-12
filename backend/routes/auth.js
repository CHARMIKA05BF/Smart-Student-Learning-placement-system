import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '7d',
  })
}

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' })
  }

  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashedPassword, role })

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrolledCourses: user.enrolledCourses || [],
      appliedJobs: user.appliedJobs || [],
    },
    token: generateToken(user._id),
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrolledCourses: user.enrolledCourses || [],
      appliedJobs: user.appliedJobs || [],
    },
    token: generateToken(user._id),
  })
})

router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('enrolledCourses', 'title').populate('appliedJobs', 'title')
  if (!user) return res.status(404).json({ message: 'User not found' })

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrolledCourses: user.enrolledCourses || [],
      appliedJobs: user.appliedJobs || [],
    },
  })
})

router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('enrolledCourses', 'title').populate('appliedJobs', 'title')
  if (!user) return res.status(404).json({ message: 'User not found' })

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrolledCourses: user.enrolledCourses || [],
      appliedJobs: user.appliedJobs || [],
    },
  })
})

export default router
