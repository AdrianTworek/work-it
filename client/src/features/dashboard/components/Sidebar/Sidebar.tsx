import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from '../../../../store'
import { selectUser } from '../../../authentication/services/slices/userSlice'
import { RoleEnum } from '../../../authentication/helpers/RequireUser'
import useGetMenuItems from '../../../../hooks/useGetMenuItems'
import useLogoutUser from '../../../../hooks/useLogoutUser'

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Avatar,
  Typography,
  Tooltip,
} from '@mui/material'

import LogoutIcon from '@mui/icons-material/Logout'
import WarningIcon from '@mui/icons-material/Warning'

const Sidebar = () => {
  const { t } = useTranslation(['common', 'dashboard'])
  const user = useAppSelector(selectUser)
  const menuItems = useGetMenuItems()
  const { logoutHandler } = useLogoutUser()
  const location = useLocation()

  return (
    <Box
      sx={{
        display: { xs: 'none', sm: 'flex' },
        flexDirection: 'column',
        position: 'sticky',
        top: 64,
        minWidth: 220,
        bottom: 0,
        pt: 3,
        height: 'calc(100vh - 64px)',
        boxShadow: '1px 0px 6px rgba(0, 0, 0, 0.25)',
      }}
    >
      <Stack
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{ width: 100, height: 100 }}
          src={
            user?.photo ||
            'https://firebasestorage.googleapis.com/v0/b/work-it-4635f.appspot.com/o/placeholder_img.jpg?alt=media&token=0283222b-84b5-4945-9f44-b342c8efe844'
          }
          alt="user photo"
        />
        <Typography variant="body1" pt={1}>
          {t('common:Hello')}{' '}
          <Typography
            sx={{ fontWeight: 600 }}
            component="span"
            variant="body1"
            color="primary"
          >
            {user?.role === RoleEnum.CANDIDATE
              ? user?.name.split(' ')[0].slice(0, 15)
              : user?.name.slice(0, 15)}
          </Typography>
        </Typography>
      </Stack>
      <List sx={{ width: '100%', pt: 2 }}>
        {menuItems?.map((item, idx) => (
          <Fragment key={item.text}>
            {item.text === t('dashboard:OfferCreator') ? (
              <Tooltip
                title={
                  !user?.employerProfile?.canCreateOffer
                    ? t(
                        'dashboard:FillInformationAboutYourCompanyInRrderToCreateOffers'
                      )!
                    : ''
                }
                placement="right"
              >
                <ListItem
                  disablePadding
                  onClick={
                    user?.employerProfile?.canCreateOffer
                      ? item.onClick
                      : () => {}
                  }
                  sx={{
                    borderRight: location.pathname.includes(item?.link)
                      ? '3px solid #16a34a'
                      : '',
                  }}
                >
                  <ListItemButton
                    disabled={!user?.employerProfile?.canCreateOffer}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          color={
                            location.pathname.includes(item?.link)
                              ? 'primary'
                              : ''
                          }
                        >
                          {item.text}{' '}
                          {!user?.employerProfile?.canCreateOffer && (
                            <WarningIcon
                              sx={{ width: 20, height: 20, color: 'orange' }}
                            />
                          )}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ) : (
              <ListItem
                disablePadding
                onClick={item.onClick}
                sx={{
                  borderRight: location.pathname.includes(item?.link)
                    ? '3px solid #16a34a'
                    : '',
                }}
              >
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        color={
                          location.pathname.includes(item?.link)
                            ? 'primary'
                            : ''
                        }
                      >
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
          </Fragment>
        ))}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={logoutHandler}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={t('dashboard:LogOut')} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )
}

export default Sidebar
