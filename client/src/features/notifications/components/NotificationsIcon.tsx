import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '../../../store'
import { selectUser } from '../../authentication/services/slices/userSlice'
import { useGetAllUserNotificationsQuery } from '../services/api/notificationApi'
import { selectNotifications } from '../services/slices/notificationsSlice'
import { selectTheme } from '../../theme/themeSlice'

import { Badge } from '@mui/material'

import NotificationsIcon from '@mui/icons-material/Notifications'

import NotificationsWindow from './NotificationsWindow'

type Props = {
  isMobile?: boolean
}

const NotificationsIconComponent = ({ isMobile }: Props) => {
  const user = useAppSelector(selectUser)
  const mode = useAppSelector(selectTheme)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const { data, error, refetch } = useGetAllUserNotificationsQuery()
  const notifications = useAppSelector(selectNotifications)

  const unreadNotificationsNumber = useMemo(
    () =>
      notifications?.reduce(
        (acc, curr) => (curr.unread ? acc + 1 : acc + 0),
        0
      ),
    [notifications]
  )

  useEffect(() => {
    refetch()
  }, [data, unreadNotificationsNumber])

  const handleNotificationsOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleNotificationsClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Badge
        sx={{
          cursor: 'pointer',
          display: isMobile
            ? { xs: 'flex', sm: 'none' }
            : { xs: 'none', sm: 'flex' },
          ml: user ? 'auto' : '0',
          mr: 1.5,
        }}
        badgeContent={unreadNotificationsNumber}
        color="secondary"
        onClick={handleNotificationsOpen}
      >
        <NotificationsIcon
          sx={{
            width: 20,
            height: 20,
            color: mode === 'dark' ? 'white' : 'black',
          }}
        />
      </Badge>

      <NotificationsWindow
        anchorEl={anchorEl}
        open={open}
        onClose={handleNotificationsClose}
        notifications={notifications}
      />
    </>
  )
}

export default NotificationsIconComponent
