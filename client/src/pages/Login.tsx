import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store'
import { selectUser } from '../features/authentication/services/slices/userSlice'

import { LoginForm } from '../features'

const Login = () => {
  const user = useAppSelector(selectUser)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user])

  if (user) return null

  return <LoginForm />
}

export default Login
