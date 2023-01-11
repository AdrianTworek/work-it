import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RoleEnum } from '../types/role';
import { AppError } from '../utils/appError';

export const restrictTo =
  (...allowedRoles: RoleEnum[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!allowedRoles.includes(user.role)) {
      return next(
        new AppError(
          StatusCodes.FORBIDDEN,
          `You don't have permission to perform this action`
        )
      );
    }

    next();
  };
