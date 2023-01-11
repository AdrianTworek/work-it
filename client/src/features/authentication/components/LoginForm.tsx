import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { object, string, TypeOf } from 'zod'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginUserMutation } from '../services/api/authApi'

import { Box, Container, Paper, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { FormInput } from '../../../components'

const loginSchema = object({
  email: string()
    .min(1, 'Email address is required')
    .email('Email address is invalid'),
  password: string()
    .min(8, 'Password must contain at least 8 characters')
    .max(32, 'Password must contain less than 32 characters'),
})

export type LoginInput = TypeOf<typeof loginSchema>

const LoginForm = () => {
  const { t } = useTranslation(['home'])
  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const [loginUser, { isLoading, isSuccess, error, isError }] =
    useLoginUserMutation()

  const navigate = useNavigate()

  const { reset, handleSubmit } = methods

  useEffect(() => {
    if (isSuccess) {
      toast.success(t('LoggedInSuccessfully'))
      navigate('/dashboard')
    }

    if (isError) {
      console.log(error)
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

  useEffect(() => {
    if (isSuccess) {
      reset()
    }
  }, [isSuccess])

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    loginUser(values)
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Paper
        sx={{ maxWidth: 375, mx: 'auto', px: 3, py: 5, borderRadius: 2 }}
        elevation={3}
      >
        <Typography variant="h4" align="center" mb={3}>
          {t('Sign in')}
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete="off"
          >
            <FormInput name="email" label={t('Email Address')} type="email" />
            <FormInput name="password" label={t('Password')} type="password" />

            <LoadingButton
              variant="contained"
              sx={{ mt: 1 }}
              fullWidth
              disableElevation
              type="submit"
              loading={isLoading}
              size="large"
            >
              Login
            </LoadingButton>

            <Typography mt={2} align="right">
              {t("Don't have an account?")}{' '}
              <Link
                to="/register"
                style={{ color: '#d97706', textDecoration: 'none' }}
              >
                {t('Register')}
              </Link>
            </Typography>
          </Box>
        </FormProvider>
      </Paper>
    </Container>
  )
}

export default LoginForm
