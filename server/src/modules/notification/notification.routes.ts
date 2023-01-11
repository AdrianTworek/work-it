import { Router } from 'express'
import deserializeUser from '../../middleware/deserializeUser'
import requireUser from '../../middleware/requireUser'
import {
  createNotificationHandler,
  deleteNotificationHandler,
  getUserNotificationsHandler,
  updateNotificationHandler,
} from './notification.controller'

const router = Router()

router.use(deserializeUser, requireUser)

router.get('/', getUserNotificationsHandler)
router.post('/', createNotificationHandler)
router.patch('/:notificationId', updateNotificationHandler)
router.delete('/:notificationId', deleteNotificationHandler)

export default router
