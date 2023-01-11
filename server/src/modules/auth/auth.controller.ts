import { CookieOptions, NextFunction, Request, Response } from 'express';
import argon2 from 'argon2';
import { omit } from 'lodash';
import { StatusCodes } from 'http-status-codes';
import {
  invalidateCookies,
  signJwt,
  signTokens,
  verifyJwt,
} from './auth.utils';
import { Prisma } from '@prisma/client';
import redisClient from '../../db/connectRedis';
import { AppError } from '../../utils/appError';
import { createUser, findUniqueUser, updateUser } from '../user/user.service';
import { CreateUserInput, LoginUserInput } from '../user/user.schema';

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  maxAge: 15 * 60 * 1000, // 15 minutes,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks,
};

export async function registerHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, name, password, role } = req.body;

    const hashedPassword = await argon2.hash(password);

    const user = await createUser({
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      role,
    });

    res.status(StatusCodes.CREATED).json(omit(user, 'password'));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(StatusCodes.CONFLICT).json({
          message: 'Email already exists, please use another email address',
        });
      }
    }
    next(error);
  }
}

export async function loginHandler(
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const user = await findUniqueUser(email);

    if (!user || !(await argon2.verify(user.password, password))) {
      return next(
        new AppError(StatusCodes.BAD_REQUEST, 'Invalid email or password')
      );
    }

    const { accessToken, refreshToken } = signTokens(omit(user, 'password'));

    await redisClient.set(user.id, JSON.stringify(omit(user, 'password')), {
      EX: 14 * 24 * 60 * 60,
    });

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
    res.cookie('loggedIn', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    res.status(StatusCodes.OK).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshAccessTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;

    const message = 'Could not refresh access token';

    if (!refreshToken) {
      return next(new AppError(StatusCodes.FORBIDDEN, message));
    }

    const decoded = verifyJwt<{ id: string }>(
      refreshToken,
      'REFRESH_TOKEN_PUBLIC_KEY'
    );

    if (!decoded) {
      return next(new AppError(StatusCodes.FORBIDDEN, message));
    }

    const session = await redisClient.get(decoded.id);

    if (!session) {
      return next(new AppError(StatusCodes.FORBIDDEN, message));
    }

    const user = await findUniqueUser(JSON.parse(session).email);

    if (!user) {
      return next(new AppError(StatusCodes.FORBIDDEN, message));
    }

    const accessToken = signJwt(user, 'ACCESS_TOKEN_PRIVATE_KEY', {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('loggedIn', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    res.status(StatusCodes.OK).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function changePasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  const { email } = res.locals.user;

  const user = await findUniqueUser(email);

  if (user && !(await argon2.verify(user.password, oldPassword))) {
    return next(new AppError(StatusCodes.BAD_REQUEST, 'Invalid password'));
  }

  if (newPassword !== confirmNewPassword) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, `Passwords do not match`)
    );
  }

  const hashedPassword = await argon2.hash(newPassword);

  await updateUser(user!.email, { password: hashedPassword });

  res.status(StatusCodes.OK).json({ message: 'Successfully changed password' });
}

export async function logoutHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await redisClient.del(res.locals.user.id);
    invalidateCookies(res);

    res.status(StatusCodes.OK).json({
      message: 'Successfully logged out',
    });
  } catch (error) {
    next(error);
  }
}
