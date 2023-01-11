import { Router } from 'express'
import deserializeUser from '../../middleware/deserializeUser'
import requireUser from '../../middleware/requireUser'
import { validate } from '../../middleware/validate'
import { registerUserSchema, loginUserSchema } from '../user/user.schema'
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  changePasswordHandler,
} from './auth.controller'

const router = Router()

router.post('/register', validate(registerUserSchema), registerHandler)
router.post('/login', validate(loginUserSchema), loginHandler)
router.get('/refresh', refreshAccessTokenHandler)
router.post(
  '/changePassword',
  deserializeUser,
  requireUser,
  changePasswordHandler
)
router.post('/logout', deserializeUser, requireUser, logoutHandler)

export default router
