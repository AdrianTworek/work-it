import { Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'

export function signJwt(
  payload: string | Buffer | object,
  keyName: 'ACCESS_TOKEN_PRIVATE_KEY' | 'REFRESH_TOKEN_PRIVATE_KEY',
  options?: SignOptions
) {
  let privateKey

  if (keyName === 'ACCESS_TOKEN_PRIVATE_KEY') {
    privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY!
  } else {
    privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY!
  }

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  })
}

export function verifyJwt<T>(
  token: string,
  keyName: 'ACCESS_TOKEN_PUBLIC_KEY' | 'REFRESH_TOKEN_PUBLIC_KEY'
): T | null {
  try {
    let publicKey

    if (keyName === 'ACCESS_TOKEN_PUBLIC_KEY') {
      publicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY!
    } else {
      publicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY!
    }

    return jwt.verify(token, publicKey) as T
  } catch (error) {
    return null
  }
}

export function signTokens(payload: string | Buffer | object) {
  const accessToken = signJwt(payload, 'ACCESS_TOKEN_PRIVATE_KEY', {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  })
  const refreshToken = signJwt(payload, 'REFRESH_TOKEN_PRIVATE_KEY', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  })

  return {
    accessToken,
    refreshToken,
  }
}

export function invalidateCookies(res: Response) {
  res.cookie('accessToken', '', { maxAge: -1 })
  res.cookie('refreshToken', '', { maxAge: -1 })
  res.cookie('loggedIn', '', { maxAge: -1 })
}
