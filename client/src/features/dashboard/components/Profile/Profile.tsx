import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from '../../../../store';
import { selectUser } from '../../../authentication/services/slices/userSlice';
import { useUpdateUserMutation } from '../../../authentication/services/api/userApi';
import { ExperienceLevelEnum } from '../../../authentication/services/api/types';
import useShowToastNotification from '../../../../hooks/useShowToastNotification';

import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { LoadingButton } from '@mui/lab';

import EscalatorIcon from '@mui/icons-material/Escalator';

import {
  ExperienceLevel,
  FormInput,
  UploadAvatar,
} from '../../../../components';
import UploadCV from './UploadCV';

const candidateProfileSchema = object({
  name: string()
    .min(1, 'Name is required')
    .max(100, 'Name must contain less than 100 characters'),
  email: string(),
  city: string()
    .max(255, 'City must contain less than 255 characters')
    .optional(),
  bio: string()
    .max(1000, 'Bio must contain less than 1000 characters')
    .optional(),
  linkedInProfile: string()
    .max(255, 'LinkedIn URL must contain less than 255 characters')
    .startsWith('https://www.linkedin.com/', {
      message: 'LinkedIn URL must start with https://linkedin.com/',
    }),
  githubProfile: string()
    .max(255, 'Github URL must contain less than 255 characters')
    .startsWith('https://www.github.com/', {
      message: 'Github URL must start with https://github.com/',
    }),
});

export type CandidateProfileInput = TypeOf<typeof candidateProfileSchema>;

const Profile = () => {
  const { t } = useTranslation(['common', 'dashboard']);
  const user = useAppSelector(selectUser);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(
    user?.candidateProfile?.phoneNumber
  );
  const [experienceLevel, setExperienceLevel] = useState<
    ExperienceLevelEnum | undefined
  >(user?.candidateProfile?.experienceLevel);
  const methods = useForm<CandidateProfileInput>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      city: user?.candidateProfile?.city || '',
      bio: user?.candidateProfile?.bio || '',
      linkedInProfile:
        user?.candidateProfile?.linkedInProfile || 'https://www.linkedin.com/',
      githubProfile:
        user?.candidateProfile?.githubProfile || 'https://www.github.com/',
    },
  });

  const [updateUser, { isLoading, isSuccess, error, isError }] =
    useUpdateUserMutation();

  useShowToastNotification({
    message: t('dashboard:YourProfileWasUpdated'),
    type: 'info',
    isLoading,
    isSuccess,
    error,
    isError,
  });

  const { handleSubmit } = methods;

  const onSubmitHandler: SubmitHandler<CandidateProfileInput> = ({
    name,
    city,
    bio,
    linkedInProfile,
    githubProfile,
  }) => {
    updateUser({
      id: user?.id,
      name,
      candidateProfile: {
        update: {
          phoneNumber,
          city,
          bio,
          linkedInProfile,
          githubProfile,
          experienceLevel,
        },
      },
    });
  };

  return (
    <Stack>
      <Typography variant="h4">{t('dashboard:CandidateProfile')}</Typography>
      <Typography variant="h6" color="text.secondary" mt={1}>
        {t('dashboard:FillInformation')}
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
                  label={t('dashboard:FullName')}
                  type="text"
                />
                <FormInput
                  name="email"
                  label={t('dashboard:EmailAddress')}
                  type="email"
                  disabled
                />
                <MuiTelInput
                  label={t('dashboard:PhoneNumber')}
                  fullWidth
                  value={phoneNumber}
                  onChange={(newValue) => setPhoneNumber(newValue)}
                />
                <FormInput
                  name="city"
                  label={t('dashboard:City')}
                  type="text"
                />
                <FormInput
                  name="bio"
                  label={t('dashboard:Bio')}
                  type="text"
                  placeholder={t('dashboard:IntroduceYourself')!}
                  multiline
                  rows={5}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <UploadCV updateUser={updateUser} />

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
                  <EscalatorIcon /> {t('dashboard:ExperienceLevel')}
                </Typography>
                <ExperienceLevel
                  experienceLevel={experienceLevel}
                  setExperienceLevel={setExperienceLevel}
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
  );
};

export default Profile;
