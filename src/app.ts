import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import 'dotenv/config'
import compression from 'compression'
import config from './configs/config.mongodb'
import router from './routes'
import { notFoundError, errorHandler } from './middlewares/errorHandler'

const app = express()
// init middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(helmet())
app.use(compression())
app.use(express.urlencoded({ extended: true }))
// init db
require('./dbs/init.mongodb')

// init routes
app.use('/v1/api', router)

// handling errors
app.use(notFoundError)
app.use(errorHandler)

app.listen(config.app.port, () => {
  console.log(`Server is running on port ${config.app.port}`)
})

process.on("SIGINT", () => {
  console.log("Server is shutting down")
  process.exit(0)
})

export default app
