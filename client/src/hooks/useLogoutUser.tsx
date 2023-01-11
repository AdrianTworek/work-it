import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLogoutUserMutation } from '../features/authentication/services/api/authApi'
import { logout } from '../features/authentication/services/slices/userSlice'

const useLogoutUser = () => {
  const { t } = useTranslation(['common'])
  const [logoutUser, { isLoading, isSuccess, error, isError }] =
    useLogoutUserMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isSuccess) {
      navigate('/login')
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        ;(error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: 'top-right',
          })
        )
      } else {
        toast.error((error as any).data.message, {
          position: 'top-right',
        })
      }
    }
  }, [isLoading])

  const logoutHandler = useCallback(() => {
    logoutUser()
    dispatch(logout())
    toast.info(t('YouWereLoggedOut'))
  }, [])

  return { logoutHandler, isLoading }
}

export default useLogoutUser
