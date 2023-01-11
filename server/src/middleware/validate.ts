import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params, query, body } = req

      schema.parse({
        params,
        query,
        body,
      })

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          errors: error.errors,
        })
      }
      next(error)
    }
  }
