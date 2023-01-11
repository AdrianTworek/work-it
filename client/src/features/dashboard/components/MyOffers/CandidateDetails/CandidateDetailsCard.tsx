import { useTranslation } from 'react-i18next'
import { IApplication } from '../../../services/api/types'

import {
  Avatar,
  Button,
  ButtonBase,
  CircularProgress,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

import EmailIcon from '@mui/icons-material/Email'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import PhoneIcon from '@mui/icons-material/Phone'
import PaidIcon from '@mui/icons-material/Paid'
import HandshakeIcon from '@mui/icons-material/Handshake'
import ConstructionIcon from '@mui/icons-material/Construction'
import GroupsIcon from '@mui/icons-material/Groups'
import ApartmentIcon from '@mui/icons-material/Apartment'
import PlaceIcon from '@mui/icons-material/Place'

import { companyTypeObj } from '../../../../../components/CompanyType'
import { companySizeObj } from '../../../../../components/CompanySize'

type Props = {
  application: IApplication | undefined
  isLoading?: boolean
}

const CandidateDetailsCard = ({ application, isLoading }: Props) => {
  const { t } = useTranslation(['dashboard'])
  const candidate = application?.candidate
  const preferences = candidate?.preferences

  if (isLoading) return <CircularProgress />

  return (
    <Paper
      elevation={3}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}
    >
      <Typography variant="h5">{candidate?.name}</Typography>

      <Divider />

      <Stack
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', md: ' row' },
        }}
      >
        <Avatar
          sx={{ width: 120, height: 120 }}
          src={candidate?.photo || ''}
          alt="candidate photo"
        />
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <ButtonBase
              target="_top"
              rel="noopener noreferrer"
              href={`mailto:${candidate?.email}`}
            >
              <EmailIcon sx={{ mr: 1 }} />
              <Typography color="text.secondary">{candidate?.email}</Typography>
            </ButtonBase>
          </Stack>
          {candidate?.candidateProfile?.linkedInProfile && (
            <Link
              sx={{ textDecoration: 'none', color: 'inherit' }}
              href={candidate?.candidateProfile?.linkedInProfile}
              target="_blank"
            >
              <Stack direction="row" spacing={1}>
                <LinkedInIcon />
                <Typography color="text.secondary">
                  {candidate?.candidateProfile?.linkedInProfile}
                </Typography>
              </Stack>
            </Link>
          )}
          {candidate?.candidateProfile?.githubProfile && (
            <Link
              sx={{ textDecoration: 'none', color: 'inherit' }}
              href={candidate?.candidateProfile?.githubProfile}
              target="_blank"
            >
              <Stack direction="row" spacing={1}>
                <GitHubIcon />
                <Typography color="text.secondary">
                  {candidate?.candidateProfile?.githubProfile}
                </Typography>
              </Stack>
            </Link>
          )}

          {candidate?.candidateProfile?.phoneNumber && (
            <Stack direction="row" spacing={1}>
              <PhoneIcon />
              <Typography color="text.secondary">
                {candidate?.candidateProfile?.phoneNumber}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>

      <Divider />

      <Stack spacing={2}>
        <Typography variant="body1" color="text.secondary">
          {t('CandidateDetails')}
        </Typography>

        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            Bio
          </Typography>
          <Typography>{candidate?.candidateProfile?.bio}</Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            {t('City')}
          </Typography>
          <Typography>{candidate?.candidateProfile?.city}</Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            {t('ExperienceLevelLower')}
          </Typography>
          <Typography>
            {candidate!
              .candidateProfile!.experienceLevel!.charAt(0)
              .toUpperCase() +
              candidate!.candidateProfile!.experienceLevel!.slice(1)}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="info"
          href={candidate?.candidateProfile?.cv || ''}
          target="_blank"
        >
          {t('SeeCV')}
        </Button>
      </Stack>

      <Divider />

      <Stack spacing={2}>
        <Typography variant="body1" color="text.secondary">
          {t('CandidatesPreferences')}
        </Typography>

        <Stack spacing={0.5}>
          <Typography
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            variant="body2"
            color="text.secondary"
          >
            <ConstructionIcon sx={{ width: 16, height: 16 }} /> {t('Category')}
          </Typography>
          <Typography>{preferences?.category}</Typography>
        </Stack>

        {preferences?.companySize && (
          <Stack spacing={0.5}>
            <Typography
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              variant="body2"
              color="text.secondary"
            >
              <GroupsIcon sx={{ width: 16, height: 16 }} /> {t('CompanySize')}
            </Typography>
            <Typography>{companySizeObj[preferences.companySize]}</Typography>
          </Stack>
        )}

        {preferences?.companyType && (
          <Stack spacing={0.5}>
            <Typography
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              variant="body2"
              color="text.secondary"
            >
              <ApartmentIcon sx={{ width: 16, height: 16 }} />{' '}
              {t('CompanyType')}
            </Typography>
            <Typography>{companyTypeObj[preferences.companyType]}</Typography>
          </Stack>
        )}

        <Stack spacing={0.5}>
          <Typography
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            variant="body2"
            color="text.secondary"
          >
            <PlaceIcon sx={{ width: 16, height: 16 }} /> {t('Location')}
          </Typography>
          <Typography>
            {preferences?.isRemote
              ? t('Remote')
              : candidate?.candidateProfile?.city}
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          <Typography
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            variant="body2"
            color="text.secondary"
          >
            <PaidIcon sx={{ width: 16, height: 16 }} /> {t('SalaryRange')}
          </Typography>
          <Typography>
            {preferences?.salaryFrom} - {preferences?.salaryTo} PLN
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          <Typography
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            variant="body2"
            color="text.secondary"
          >
            <HandshakeIcon sx={{ width: 16, height: 16 }} />{' '}
            {t('AgreementType')}
          </Typography>
          <Typography>
            {t(preferences?.agreementType?.toUpperCase() || '')}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default CandidateDetailsCard
