import { NextFunction, Request, Response } from 'express'
import lodash from 'lodash'
import { StatusCodes } from 'http-status-codes'
import redisClient from '../db/connectRedis'
import { AppError } from '../utils/appError'
import { verifyJwt } from '../modules/auth/auth.utils'
import { findUniqueUser } from '../modules/user/user.service'

async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let accessToken

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      accessToken = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken
    }

    if (!accessToken) {
      return next(
        new AppError(StatusCodes.UNAUTHORIZED, 'You are not logged in')
      )
    }

    // Validate the access token
    const decoded = verifyJwt<{ id: string }>(
      accessToken,
      'ACCESS_TOKEN_PUBLIC_KEY'
    )

    if (!decoded) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `Invalid token or user doesn't exist`
        )
      )
    }

    // Check if the user has a valid session
    const session = await redisClient.get(decoded.id)

    if (!session) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `Invalid token or session has expired`
        )
      )
    }

    // Check if the user still exists
    const user = await findUniqueUser(JSON.parse(session).email)

    if (!user) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `User with that token doesn't exist`
        )
      )
    }

    // Add user to res.locals
    res.locals.user = lodash.omit(user, 'password')

    next()
  } catch (err: any) {
    next(err)
  }
}

export default deserializeUser
