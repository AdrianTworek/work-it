import { createClient } from 'redis'
import logger from '../utils/logger'

const url = 'redis://localhost:6379'

const redisClient = createClient({
  url,
})

const connectRedis = async () => {
  try {
    await redisClient.connect()
    logger.info(`Redis client connected at: ${url}`)
    redisClient.set('healthcheck', 'Welcome to workIT')
  } catch (error) {
    console.log(error)
    setTimeout(connectRedis, 5000)
  }
}

connectRedis()

export default redisClient
