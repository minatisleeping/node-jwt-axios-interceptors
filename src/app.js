import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db
import './databases/init.mongodb.js'

// init routes
app.get('/', (req, res, next) => {
  return res.status(200).json({ message: 'Hello World' })
})
// handling errors

export default app
