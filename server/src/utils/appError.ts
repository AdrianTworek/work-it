import { NextFunction, Request, Response } from 'express'
import logger from './logger'

export class AppError extends Error {
  status: string
  isOperational: boolean

  constructor(public statusCode: number, public message: string) {
    super(message)
    this.statusCode = statusCode
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`Error: ${err.message}`)

  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
}
