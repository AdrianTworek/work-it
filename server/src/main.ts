import express from 'express'
import { createServer } from 'http'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { StatusCodes } from 'http-status-codes'
import logger from './utils/logger'
import { globalErrorHandler } from './utils/appError'
import { PrismaClient } from '@prisma/client'
import redisClient from './db/connectRedis'
import userRouter from './modules/user/user.routes'
import authRouter from './modules/auth/auth.routes'
import offerRouter from './modules/offer/offer.routes'
import applicationRouter from './modules/application/application.routes'
import notificationRouter from './modules/notification/notification.routes'
import { Server } from 'socket.io'

config()

const prisma = new PrismaClient()
const app = express()
const server = createServer(app)

// Socket
let users: { [uid: string]: string } = {}

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
})

function getUidFromSocketId(socketId: string) {
  return Object.keys(users).find((uid) => users[uid] === socketId)
}

io.on('connection', (socket) => {
  socket.on('user_connected', (uid) => {
    if (users[uid]) return
    users[uid] = socket.id
    // socket.emit('users', users)
  })

  socket.on('send_notification', (notification) => {
    io.to(users[notification.recipientId]).emit(
      'receive_notification',
      notification
    )
  })

  socket.on('disconnect', () => {
    const uid = getUidFromSocketId(socket.id)

    if (uid) {
      delete users[uid]
    }
  })
})

async function bootstrap() {
  const HOST = process.env.HOST || 'http://localhost'
  const PORT = process.env.PORT || 5000
  const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

  app.use(express.json({ limit: '30kb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(
    cors({
      origin: CORS_ORIGIN,
      credentials: true,
    })
  )
  app.use(helmet())

  // Routes
  app.use('/api/auth', authRouter)
  app.use('/api/users', userRouter)
  app.use('/api/offers', offerRouter)
  app.use('/api/applications', applicationRouter)
  app.use('/api/notifications', notificationRouter)

  // Healthcheck
  app.get('/', async (_, res) => {
    const message = await redisClient.get('healthcheck')

    res.status(StatusCodes.OK).json({
      message,
    })
  })

  // Global error handler
  app.use(globalErrorHandler)

  server.listen(PORT, () => {
    logger.info(`Server is listening at ${HOST}:${PORT}`)
  })
}

bootstrap()
  .catch((err) => {
    throw err
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
