import { Router } from 'express'
import deserializeUser from '../../middleware/deserializeUser'
import requireUser from '../../middleware/requireUser'
import { restrictTo } from '../../middleware/restrictTo'
import { RoleEnum } from '../../types/role'
import {
  deleteUserHandler,
  fetchUsersHandler,
  getMeHandler,
  updateUserHandler,
} from './user.controller'

const router = Router()

router.use(deserializeUser, requireUser)

router.get('/', restrictTo(RoleEnum.ADMIN), fetchUsersHandler)
router.get('/me', getMeHandler)
router.patch('/:userId', updateUserHandler)
router.delete('/:userId', deleteUserHandler)

export default router
