require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// routes
const authRoute = require('./routes/authRoute')

const app = express()

app.use(morgan('tiny'))
app.use(express.json())

app.use('/api/v1/auth', authRoute)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => console.log(`App is running at port ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()
