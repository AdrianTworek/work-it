import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { object, string, TypeOf } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useRegisterUserMutation } from '../services/api/authApi'

import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { FormInput } from '../../../components'
import { RoleEnum } from '../helpers/RequireUser'

const registerSchema = object({
  name: string()
    .min(1, 'Name is required')
    .max(100, 'Name must contain less than 100 characters'),
  email: string()
    .min(1, 'Email address is required')
    .email('Email address is invalid'),
  password: string()
    .min(8, 'Password must contain at least 8 characters')
    .max(32, 'Password must contain less than 32 characters'),
  passwordConfirm: string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
})

export type RegisterInput = TypeOf<typeof registerSchema> & { role?: RoleEnum }

enum RegisterTypeEnum {
  CANDIDATE = 'Candidate',
  EMPLOYER = 'Employer',
}

const RegisterForm = () => {
  const { t } = useTranslation(['home'])
  const [registerType, setRegisterType] = useState<RegisterTypeEnum>(
    RegisterTypeEnum.CANDIDATE
  )

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const [registerUser, { isLoading, isSuccess, error, isError }] =
    useRegisterUserMutation()

  const navigate = useNavigate()

  const { reset, handleSubmit } = methods

  useEffect(() => {
    if (isSuccess) {
      toast.success(t('UserRegisteredSuccessfully'))
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

  useEffect(() => {
    reset()
  }, [isSuccess])

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    if (registerType === 'Candidate') {
      registerUser({ ...values, role: RoleEnum.CANDIDATE })
    } else {
      registerUser({ ...values, role: RoleEnum.EMPLOYER })
    }
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Paper
        sx={{ maxWidth: 375, mx: 'auto', px: 3, py: 5, borderRadius: 2 }}
        elevation={3}
      >
        <Typography variant="h4" align="center" mb={2}>
          {t('Sign up as')}
        </Typography>

        <Stack direction="row" spacing={2} mt={2}>
          {Object.values(RegisterTypeEnum).map((item) => (
            <Button
              key={item}
              variant={registerType === item ? 'contained' : 'outlined'}
              color="secondary"
              size="medium"
              fullWidth
              onClick={() => setRegisterType(item)}
            >
              {t(item)}
            </Button>
          ))}
        </Stack>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete="off"
            mt={3}
          >
            <FormInput
              name="name"
              label={
                registerType === 'Candidate'
                  ? t('Full Name')
                  : t('Company Name')
              }
              type="text"
            />
            <FormInput name="email" label={t('Email Address')} type="email" />
            <FormInput name="password" label={t('Password')} type="password" />
            <FormInput
              name="passwordConfirm"
              label={t('Confirm Password')}
              type="password"
            />

            <LoadingButton
              variant="contained"
              sx={{ mt: 1 }}
              fullWidth
              disableElevation
              type="submit"
              loading={isLoading}
              size="large"
            >
              {t('Register')}
            </LoadingButton>

            <Typography mt={2} align="right">
              {t('Already have an account?')}{' '}
              <Link
                to="/login"
                style={{ color: '#d97706', textDecoration: 'none' }}
              >
                {t('Login')}
              </Link>
            </Typography>
          </Box>
        </FormProvider>
      </Paper>
    </Container>
  )
}

export default RegisterForm
