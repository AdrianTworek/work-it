import { NotificationTypeEnum } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../utils/appError'
import {
  createNotification,
  deleteNotification,
  findNotification,
  findUserNotifications,
  updateNotification,
} from './notification.service'

export async function createNotificationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { recipientId, message, type, image, redirectUrl } = req.body

    const notification = await createNotification({
      message,
      type,
      image,
      redirectUrl,
      recipient: { connect: { id: recipientId } },
    })

    return res.status(StatusCodes.CREATED).json(notification)
  } catch (error) {
    console.log(error)
    next(new AppError(StatusCodes.BAD_REQUEST, 'Could not create notification'))
  }
}

export async function getUserNotificationsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user

    const notifications = await findUserNotifications(id)

    return res.status(StatusCodes.OK).json(notifications)
  } catch (error) {
    next(
      new AppError(StatusCodes.NOT_FOUND, 'Could not found any notification')
    )
  }
}

export async function updateNotificationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { notificationId } = req.params
    const { id } = res.locals.user

    let notification = await findNotification(notificationId)

    if (!notification) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Not found notification with id ${notificationId}`
        )
      )
    }

    if (notification?.recipientId === id) {
      notification = await updateNotification(notificationId, req.body)
    } else {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          'You are not recipient of that notification'
        )
      )
    }

    return res.status(StatusCodes.OK).json(notification)
  } catch (error) {
    console.log(error)
    next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        'Could not update that notification'
      )
    )
  }
}

export async function deleteNotificationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { notificationId } = req.params
    const { id } = res.locals.user

    let notification = await findNotification(notificationId)

    if (!notification) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Not found notification with id ${notificationId}`
        )
      )
    }

    if (notification?.recipientId === id) {
      await deleteNotification(notificationId)
    } else {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          'You are not recipient of that notification'
        )
      )
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Successfully deleted notification' })
  } catch (error) {
    console.log(error)
    next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        'Could not delete that notification'
      )
    )
  }
}
