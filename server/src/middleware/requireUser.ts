import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../utils/appError'

function requireUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = res.locals

    if (!user) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `Invalid token or session has expired`
        )
      )
    }

    next()
  } catch (error) {
    next(error)
  }
}

export default requireUser
