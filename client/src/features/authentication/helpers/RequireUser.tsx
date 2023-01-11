import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { userApi } from '../services/api/userApi'

import { FullScreenLoader } from '../../../components'

export enum RoleEnum {
  ADMIN = 'admin',
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
}

type RequiredUserProps = {
  restrictTo: RoleEnum[]
}

const RequireUser = ({ restrictTo }: RequiredUserProps) => {
  const [cookies] = useCookies(['loggedIn'])
  const location = useLocation()

  const { isLoading, isFetching } = userApi.endpoints.getMe.useQuery(null, {
    skip: false,
    refetchOnMountOrArgChange: true,
  })

  const user = userApi.endpoints.getMe.useQueryState(null, {})

  if (isLoading || isFetching) {
    return <FullScreenLoader />
  }

  return (cookies.loggedIn || user) &&
    restrictTo.includes(user?.data?.role as RoleEnum) ? (
    <Outlet />
  ) : cookies.loggedIn && user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default RequireUser
