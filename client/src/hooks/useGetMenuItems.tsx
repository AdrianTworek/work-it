import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store'
import { selectUser } from '../features/authentication/services/slices/userSlice'
import { RoleEnum } from '../features/authentication/helpers/RequireUser'

import PersonIcon from '@mui/icons-material/Person'
import Settings from '@mui/icons-material/Settings'
import GroupIcon from '@mui/icons-material/Group'
import HomeIcon from '@mui/icons-material/Home'
import WorkIcon from '@mui/icons-material/Work'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import AddCircleIcon from '@mui/icons-material/AddCircle'

const useGetMenuItems = () => {
  const { t } = useTranslation(['common'])
  const user = useAppSelector(selectUser)
  const navigate = useNavigate()

  const menuItems =
    user?.role === RoleEnum.CANDIDATE
      ? [
          {
            text: t('My Profile'),
            icon: <PersonIcon />,
            link: '/candidate/dashboard/profile',
            onClick: () => navigate('/candidate/dashboard/profile'),
          },
          {
            text: t('Preferences'),
            icon: <LoyaltyIcon />,
            link: '/candidate/dashboard/preferences',
            onClick: () => navigate('/candidate/dashboard/preferences'),
          },
          {
            text: t('Applications'),
            icon: <WorkIcon />,
            link: '/candidate/dashboard/applications',
            onClick: () => navigate('/candidate/dashboard/applications'),
          },
          {
            text: t('Settings'),
            icon: <Settings />,
            link: '/candidate/dashboard/settings',
            onClick: () => navigate('/candidate/dashboard/settings'),
          },
        ]
      : user?.role === RoleEnum.EMPLOYER
      ? [
          {
            text: t('Company'),
            icon: <HomeIcon />,
            link: '/employer/dashboard/profile',
            onClick: () => navigate('/employer/dashboard/profile'),
          },
          {
            text: t('Offer Creator'),
            icon: <AddCircleIcon />,
            link: '/employer/dashboard/offerCreator',
            onClick: () => navigate('/employer/dashboard/offerCreator'),
          },
          {
            text: t('My Offers'),
            icon: <WorkIcon />,
            link: '/employer/dashboard/offers',
            onClick: () => navigate('/employer/dashboard/offers'),
          },
          {
            text: t('Candidates'),
            icon: <GroupIcon />,
            link: '/employer/dashboard/candidates',
            onClick: () => navigate('/employer/dashboard/candidates'),
          },
          {
            text: t('Settings'),
            icon: <Settings />,
            link: '/employer/dashboard/settings',
            onClick: () => navigate('/employer/dashboard/settings'),
          },
        ]
      : null

  return menuItems
}

export default useGetMenuItems
