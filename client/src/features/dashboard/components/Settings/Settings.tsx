import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { object, string, TypeOf } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useChangePasswordMutation } from '../../../authentication/services/api/authApi'
import useShowToastNotification from '../../../../hooks/useShowToastNotification'

import { Box, IconButton, Paper, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import DeleteIcon from '@mui/icons-material/Delete'

import DeleteAccountDialog from './DeleteAccountDialog'
import { FormInput } from '../../../../components'

const changePasswordSchema = object({
  oldPassword: string().min(1, 'Old password is required'),
  newPassword: string()
    .min(8, 'New password must contain at least 8 characters')
    .max(32, 'Password must contain less than 32 characters'),
  confirmNewPassword: string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  path: ['confirmNewPassword'],
  message: 'Passwords do not match',
})

export type ChangePasswordInput = TypeOf<typeof changePasswordSchema>

const Settings = () => {
  const { t } = useTranslation(['common', 'dashboard'])
  const [open, setOpen] = useState(false)
  const methods = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  })

  const [changePassword, { isLoading, isSuccess, error, isError }] =
    useChangePasswordMutation()

  useShowToastNotification({
    message: t('dashboard:SuccessfullyChangedPassword'),
    type: 'success',
    isLoading,
    isSuccess,
    error,
    isError,
  })

  const { reset, handleSubmit } = methods

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  useEffect(() => {
    if (isSuccess) {
      reset()
    }
  }, [isSuccess])

  const onSubmitHandler: SubmitHandler<ChangePasswordInput> = (values) => {
    changePassword(values)
  }

  return (
    <>
      <Stack>
        <Typography variant="h4">{t('common:Settings')}</Typography>
        <Paper
          elevation={3}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, mt: 3 }}
        >
          <Stack spacing={3} alignItems="flex-start">
            <Typography variant="h5">
              {t('dashboard:ChangePassword')}
            </Typography>
            <FormProvider {...methods}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmitHandler)}
                noValidate
                autoComplete="off"
                mt={3}
              >
                <FormInput
                  name="oldPassword"
                  label={t('dashboard:OldPassword')}
                  type="password"
                  sx={{ maxWidth: 300 }}
                />
                <FormInput
                  name="newPassword"
                  label={t('dashboard:NewPassword')}
                  type="password"
                  sx={{ maxWidth: 300 }}
                />
                <FormInput
                  name="confirmNewPassword"
                  label={t('dashboard:ConfirmNewPassword')}
                  type="password"
                  sx={{ maxWidth: 300 }}
                />
                <LoadingButton
                  variant="contained"
                  sx={{ mt: 1 }}
                  disableElevation
                  type="submit"
                  loading={isLoading}
                  size="large"
                >
                  {t('dashboard:Update')}
                </LoadingButton>
              </Box>
            </FormProvider>
          </Stack>
        </Paper>

        <Paper
          elevation={3}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, mt: 3 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5">
              {t('dashboard:DeleteYourAccount')}
            </Typography>
            <IconButton color="error" onClick={handleOpen}>
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
        </Paper>
      </Stack>

      <DeleteAccountDialog open={open} setOpen={setOpen} />
    </>
  )
}

export default Settings
