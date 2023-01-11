import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { omit } from 'lodash'
import { AppError } from '../../utils/appError'
import {
  createApplication,
  deleteApplication,
  findApplication,
  findCandidateApplications,
  updateApplication,
} from './application.service'

export async function createApplicationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user
    const { offerId } = req.body

    const application = await createApplication({
      candidate: { connect: { id } },
      offer: { connect: { id: offerId } },
    })

    const candidate = omit(application.candidate, 'password')
    const result = { ...application, candidate }

    return res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(new AppError(StatusCodes.BAD_REQUEST, 'Could not apply for this job'))
  }
}

export async function fetchCandidateApplicationsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = res.locals

    const applications = await findCandidateApplications(user.id)

    const results = applications.map((el) => {
      const employer = omit(el.offer.employer, 'password')
      return { ...el, offer: { ...el.offer, employer } }
    })

    return res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(
      new AppError(StatusCodes.NOT_FOUND, 'Could not found any applications')
    )
  }
}

export async function fetchApplication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { applicationId } = req.params

    const application = await findApplication(applicationId)

    if (!application) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Could not found application with id ${applicationId}`
        )
      )
    }

    const candidate = omit(application.candidate, 'password')
    const employer = omit(application.offer.employer, 'password')
    const result = { ...application, candidate, employer }

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(
      new AppError(
        StatusCodes.NOT_FOUND,
        `Could not found application with that id`
      )
    )
  }
}

export async function deleteApplicationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user
    const { applicationId } = req.params

    const application = await findApplication(applicationId)

    if (!application) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Could not find application with id ${applicationId}`
        )
      )
    }

    if (application.candidateId !== id) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `You are not author of that application`
        )
      )
    }

    await deleteApplication(applicationId)

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Successfully deleted application' })
  } catch (error) {
    next(
      new AppError(StatusCodes.BAD_REQUEST, 'Could not delete this application')
    )
  }
}

export async function updateApplicationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = res.locals.user
    const { applicationId } = req.params

    const application = await findApplication(applicationId)

    if (!application) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Could not find application with id ${applicationId}`
        )
      )
    }

    if (application.offer.employerId !== id) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          `You are not author of the offer belonging to that application`
        )
      )
    }

    const updatedApplication = await updateApplication(applicationId, req.body)

    return res.status(StatusCodes.OK).json(updatedApplication)
  } catch (error) {
    next(
      new AppError(StatusCodes.BAD_REQUEST, 'Could not update this application')
    )
  }
}
