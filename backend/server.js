import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import courseRoutes from './routes/courses.js'
import assignmentRoutes from './routes/assignments.js'
import jobRoutes from './routes/jobs.js'

dotenv.config()

const app = express()
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

connectDB()

app.use(cors({ origin: CLIENT_URL }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/assignments', assignmentRoutes)
app.use('/api/jobs', jobRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Smart Student Learning & Placement Management API' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
