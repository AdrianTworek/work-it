import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { deleteUser, findUsers, updateUser } from './user.service'
import { AppError } from '../../utils/appError'
import { invalidateCookies } from '../auth/auth.utils'
import redisClient from '../../db/connectRedis'
import { RoleEnum } from '../../types/role'
import { omit } from 'lodash'
import { checkIfCanCreateOffer } from './user.utils'

export async function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = res.locals

    if (user) {
      return res.status(StatusCodes.OK).json(user)
    }
  } catch (error) {
    next(error)
  }
}

export async function fetchUsersHandler(req: Request, res: Response) {
  const users = await findUsers()
  res.send(users)
}

export async function updateUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = res.locals
    const { userId } = req.params

    if (user.id === userId) {
      let updatedUser = await updateUser(user.email, req.body)
      if (user.role === RoleEnum.EMPLOYER) {
        // @ts-ignore
        updatedUser = await checkIfCanCreateOffer(updatedUser)
      }

      res.status(StatusCodes.OK).json(omit(updatedUser, 'password'))
    }
  } catch (error) {
    next(
      new AppError(StatusCodes.BAD_REQUEST, 'Fields you provided are invalid')
    )
  }
}

export async function deleteUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = res.locals
    const { userId } = req.params

    if (user.role === RoleEnum.ADMIN || user.id === userId) {
      await deleteUser(req.params.userId)
      await redisClient.del(req.params.userId)
      invalidateCookies(res)

      res.status(StatusCodes.OK).json({ message: 'User successfully deleted' })
    } else {
      next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `You don't have permission to perform this action`
        )
      )
    }
  } catch (error) {
    next(new AppError(StatusCodes.NOT_FOUND, 'User not found'))
  }
}
