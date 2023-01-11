import { Router } from 'express'
import deserializeUser from '../../middleware/deserializeUser'
import requireUser from '../../middleware/requireUser'
import { restrictTo } from '../../middleware/restrictTo'
import { RoleEnum } from '../../types/role'
import {
  createApplicationHandler,
  deleteApplicationHandler,
  fetchApplication,
  fetchCandidateApplicationsHandler,
  updateApplicationHandler,
} from './application.controller'

const router = Router()

router.use(deserializeUser, requireUser)

router.get(
  '/',
  restrictTo(RoleEnum.CANDIDATE),
  fetchCandidateApplicationsHandler
)
router.get('/:applicationId', restrictTo(RoleEnum.EMPLOYER), fetchApplication)
router.post('/', restrictTo(RoleEnum.CANDIDATE), createApplicationHandler)
router.delete(
  '/:applicationId',
  restrictTo(RoleEnum.CANDIDATE),
  deleteApplicationHandler
)
router.patch(
  '/:applicationId',
  restrictTo(RoleEnum.EMPLOYER),
  updateApplicationHandler
)

export default router
