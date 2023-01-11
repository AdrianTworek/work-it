import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store'
import { selectUser } from '../features/authentication/services/slices/userSlice'

import { RegisterForm } from '../features'

const Register = () => {
  const user = useAppSelector(selectUser)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user])

  if (user) return null

  return <RegisterForm />
}

export default Register
