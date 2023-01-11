import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { object, string, TypeOf } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppSelector } from '../../../../store'
import { selectUser } from '../../../authentication/services/slices/userSlice'
import { useUpdateUserMutation } from '../../../authentication/services/api/userApi'
import {
  CompanySizeEnum,
  CompanyTypeEnum,
} from '../../../authentication/services/api/types'
import useShowToastNotification from '../../../../hooks/useShowToastNotification'

import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { MuiTelInput } from 'mui-tel-input'

import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LinkIcon from '@mui/icons-material/Link'
import GroupsIcon from '@mui/icons-material/Groups'
import ApartmentIcon from '@mui/icons-material/Apartment'

import {
  CompanySize,
  CompanyType,
  FormInput,
  UploadAvatar,
} from '../../../../components'
import { LoadingButton } from '@mui/lab'

const companyProfileSchema = object({
  name: string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must contain less than 100 characters'),
  email: string(),
  address: string()
    .max(255, 'City must contain less than 255 characters')
    .optional(),
  foundedIn: string().max(20).optional(),
  bio: string()
    .max(1000, 'Bio must contain less than 1000 characters')
    .optional(),
  linkedInProfile: string()
    .max(255, 'LinkedIn URL must contain less than 255 characters')
    .startsWith('https://www.linkedin.com/company/', {
      message: 'LinkedIn URL must start with https://www.linkedin.com/company',
    })
    .optional(),
  websiteUrl: string()
    .max(255, 'Website URL must contain less than 255 characters')
    .optional(),
})

export type CompanyProfileInput = TypeOf<typeof companyProfileSchema>

const Company = () => {
  const { t } = useTranslation(['dashboard'])
  const user = useAppSelector(selectUser)
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(
    user?.employerProfile?.phoneNumber
  )
  const [companySize, setCompanySize] = useState<CompanySizeEnum | undefined>(
    user?.employerProfile?.companySize
  )
  const [companyType, setCompanyType] = useState<CompanyTypeEnum | undefined>(
    user?.employerProfile?.companyType
  )
  const methods = useForm<CompanyProfileInput>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      address: user?.employerProfile?.address || '',
      foundedIn: user?.employerProfile?.foundedIn || '',
      bio: user?.employerProfile?.bio || '',
      linkedInProfile:
        user?.employerProfile?.linkedInProfile ||
        'https://www.linkedin.com/company/',
      websiteUrl: user?.employerProfile?.websiteUrl || '',
    },
  })

  const [updateUser, { isLoading, isSuccess, error, isError }] =
    useUpdateUserMutation()

  useShowToastNotification({
    message: t('CompanyProfileWasUpdated'),
    type: 'info',
    isLoading,
    isSuccess,
    error,
    isError,
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CompanyProfileInput> = ({
    name,
    address,
    foundedIn,
    bio,
    linkedInProfile,
    websiteUrl,
  }) => {
    updateUser({
      id: user?.id,
      name,
      employerProfile: {
        update: {
          phoneNumber,
          address,
          foundedIn,
          bio,
          linkedInProfile,
          websiteUrl,
          companySize,
          companyType,
        },
      },
    })
  }

  return (
    <Stack>
      <Typography variant="h4">{t('dashboard:CompanyProfile')}</Typography>
      <Typography variant="h6" color="text.secondary" mt={1}>
        {t('dashboard:FillInformationCompany')}
      </Typography>

      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
        >
          <Grid container spacing={2} mt={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {t('dashboard:Details')}
                </Typography>

                <Box sx={{ m: 'auto' }}>
                  <UploadAvatar />
                </Box>

                <FormInput
                  name="name"
                  label={t('dashboard:CompanyName')}
                  type="text"
                />
                <FormInput
                  name="email"
                  label={t('dashboard:EmailAddress')}
                  type="email"
                  disabled
                />
                <FormInput
                  name="address"
                  label={t('dashboard:Address')}
                  type="text"
                />
                <FormInput
                  name="foundedIn"
                  label={t('dashboard:FoundedIn')}
                  type="text"
                  placeholder={t('dashboard:Year')!}
                />
                <MuiTelInput
                  label={t('dashboard:PhoneNumber')}
                  fullWidth
                  value={phoneNumber}
                  onChange={(newValue) => setPhoneNumber(newValue)}
                />
                <FormInput
                  name="bio"
                  label={t('dashboard:Bio')}
                  type="text"
                  placeholder={t('dashboard:DescribeYourCompany')!}
                  multiline
                  rows={5}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}
              >
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {t('dashboard:Links')}
                </Typography>

                <FormInput
                  name="linkedInProfile"
                  label={t('LinkedInCompanyProfile')}
                  type="text"
                  startAdornment={<LinkedInIcon sx={{ mr: 1 }} />}
                />
                <FormInput
                  name="websiteUrl"
                  label={t('Website')}
                  type="text"
                  startAdornment={<LinkIcon sx={{ mr: 1 }} />}
                />
              </Paper>

              <Paper
                elevation={3}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  p: 3,
                  mt: 3,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <GroupsIcon /> {t('dashboard:CompanySize')}
                </Typography>

                <CompanySize
                  companySize={companySize}
                  setCompanySize={setCompanySize}
                />
              </Paper>

              <Paper
                elevation={3}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  p: 3,
                  mt: 3,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <ApartmentIcon /> {t('dashboard:CompanyType')}
                </Typography>

                <CompanyType
                  companyType={companyType}
                  setCompanyType={setCompanyType}
                />
              </Paper>
            </Grid>
          </Grid>

          <LoadingButton
            variant="contained"
            sx={{ mt: 3 }}
            disableElevation
            type="submit"
            loading={isLoading}
          >
            {t('dashboard:Update')}
          </LoadingButton>
        </Box>
      </FormProvider>
    </Stack>
  )
}

export default Company
