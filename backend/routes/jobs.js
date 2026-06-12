import express from 'express'
import Job from '../models/Job.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('admin', 'trainer'), async (req, res) => {
  const { title, company, location, description } = req.body
  if (!title || !company || !description) {
    return res.status(400).json({ message: 'Title, company, and description are required' })
  }

  const job = await Job.create({
    title,
    company,
    location,
    description,
    postedBy: req.user._id,
  })

  res.status(201).json(job)
})

router.get('/', protect, async (req, res) => {
  const jobs = await Job.find().populate('postedBy', 'name email')
  res.json(jobs)
})

router.post('/:id/apply', protect, authorizeRoles('student'), async (req, res) => {
  const job = await Job.findById(req.params.id)
  if (!job) return res.status(404).json({ message: 'Job not found' })

  job.applicants.addToSet(req.user._id)
  await job.save()

  req.user.appliedJobs.addToSet(job._id)
  await req.user.save()

  res.json({ message: 'Applied successfully', job })
})

export default router
