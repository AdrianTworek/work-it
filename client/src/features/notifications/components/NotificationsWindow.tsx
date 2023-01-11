import { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Moment from 'react-moment'
import {
  useDeleteNotificationMutation,
  useUpdateNotificationMutation,
} from '../services/api/notificationApi'
import { INotification } from '../services/api/types'

import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'

import { Delete } from '@mui/icons-material'
import CircleIcon from '@mui/icons-material/Circle'

type Props = {
  anchorEl: any
  open: boolean
  onClose: () => void
  notifications: INotification[] | undefined
}

const NotificationsWindow = ({
  anchorEl,
  open,
  onClose,
  notifications,
}: Props) => {
  const { t, i18n } = useTranslation(['common'])
  const [updateNotification] = useUpdateNotificationMutation()
  const [deleteNotification] = useDeleteNotificationMutation()
  const navigate = useNavigate()

  const handleClickNotification = (notification: INotification) => {
    updateNotification({ id: notification.id, body: { unread: false } })
    onClose()
    if (notification.redirectUrl) {
      navigate(notification.redirectUrl)
    }
  }

  const handleDeleteNotification = (e: MouseEvent, id: string) => {
    e.stopPropagation()
    deleteNotification({ id })
  }

  return (
    <Menu
      id="notifications"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      sx={{ maxHeight: 425 }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, px: 2, pb: 1 }}>
        {t('Notifications')}
      </Typography>
      <Divider />
      {notifications?.map((el) => (
        <MenuItem
          disableRipple={true}
          key={el.id}
          sx={{
            display: 'flex',
            maxWidth: 350,
            gap: 1,
          }}
          onClick={() => handleClickNotification(el)}
        >
          <CircleIcon
            sx={{
              width: 8,
              height: 8,
              color: el.unread ? '#16a34a' : 'transparent',
            }}
          />
          <Avatar src={el.image || ''} />
          <Stack>
            <Typography variant="body2">
              {el.message.length > 30
                ? `${el.message.slice(0, 29)}...`
                : el.message}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              <Moment fromNow locale={i18n.language}>
                {el.createdAt}
              </Moment>
            </Typography>
          </Stack>

          <IconButton
            color="error"
            onClick={(e) => handleDeleteNotification(e, el.id)}
            sx={{ ml: 'auto' }}
          >
            <Delete sx={{ width: 16, height: 16 }} />
          </IconButton>
        </MenuItem>
      ))}

      {!notifications?.length && (
        <Typography sx={{ p: 2 }}>
          {t("You don't have any notifications")}
        </Typography>
      )}
    </Menu>
  )
}

export default NotificationsWindow
