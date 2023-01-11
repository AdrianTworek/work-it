import { useLocation } from 'react-router-dom'
import { selectUser } from '../../authentication/services/slices/userSlice'
import { RoleEnum } from '../../authentication/helpers/RequireUser'
import { useAppSelector } from '../../../store'

import {
  Settings,
  Profile,
  Applications,
  Company,
  MyOffers,
  CandidateDetails,
  Candidates,
  Preferences,
  OfferCreator,
} from '../components'

const DashboardContent = () => {
  const user = useAppSelector(selectUser)
  const { pathname } = useLocation()

  let content

  if (user?.role === RoleEnum.CANDIDATE) {
    if (pathname.includes('profile')) {
      content = <Profile />
    }
    if (pathname.includes('preferences')) {
      content = <Preferences />
    }
    if (pathname.includes('applications')) {
      content = <Applications />
    }
    if (pathname.includes('settings')) {
      content = <Settings />
    }
  } else if (user?.role === RoleEnum.EMPLOYER) {
    if (pathname.includes('profile')) {
      content = <Company />
    }
    if (pathname.includes('offerCreator')) {
      content = <OfferCreator />
    }
    if (pathname.includes('offers')) {
      content = <MyOffers />
    }
    if (pathname.includes('apps')) {
      content = <CandidateDetails />
    }
    if (pathname.includes('candidates')) {
      content = <Candidates />
    }
    if (pathname.includes('settings')) {
      content = <Settings />
    }
  }

  return content || null
}

export default DashboardContent
