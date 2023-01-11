import { useCookies } from 'react-cookie'
import { userApi } from '../services/api/userApi'

import FullScreenLoader from '../../../components/FullScreenLoader'

type AuthMiddlewareProps = {
  children: React.ReactElement
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const [cookies] = useCookies(['loggedIn'])

  const { isLoading } = userApi.endpoints.getMe.useQuery(null, {
    skip: !cookies.loggedIn,
  })

  if (isLoading) {
    return <FullScreenLoader />
  }

  return children
}

export default AuthMiddleware
