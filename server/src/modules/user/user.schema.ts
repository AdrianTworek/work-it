import { object, string, TypeOf, z } from 'zod'
import { RoleEnum } from '../../types/role'

export const registerUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    email: string({
      required_error: 'Email address is required',
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required',
    })
      .min(8, 'Password must contain at least 8 characters')
      .max(30, 'Password must not contain more than 30 characters'),
    passwordConfirm: string({
      required_error: 'Please confirm your password',
    }),
    role: z.optional(z.nativeEnum(RoleEnum)),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
})

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email address is required',
    }).email('Invalid email or password'),
    password: string({
      required_error: 'Password is required',
    }).min(8, 'Invalid email or password'),
  }),
})

export type CreateUserInput = Omit<
  TypeOf<typeof registerUserSchema>['body'],
  'passwordConfirm'
>

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body']
