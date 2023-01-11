import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IOffer } from '../../dashboard/services/api/types'

import { Avatar, Divider, Link, Paper, Stack, Typography } from '@mui/material'

import EscalatorIcon from '@mui/icons-material/Escalator'
import ConstructionIcon from '@mui/icons-material/Construction'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import TagFacesIcon from '@mui/icons-material/TagFaces'
import GroupsIcon from '@mui/icons-material/Groups'
import ApartmentIcon from '@mui/icons-material/Apartment'
import ScheduleIcon from '@mui/icons-material/Schedule'

import DetailsList from './DetailsList'
import { companySizeObj } from '../../../components/CompanySize'
import { companyTypeObj } from '../../../components/CompanyType'

type Props = {
  data: IOffer | undefined
  employer: IOffer['employer'] | undefined
}

const OfferDescription = ({ data, employer }: Props) => {
  const { t } = useTranslation(['common'])

  const detailsList = useMemo(
    () => [
      {
        title: t('Responsibilities'),
        data: data?.responsibilities,
        icon: <PlaylistAddCheckIcon />,
      },
      { title: t('Must have'), data: data?.mustHaves, icon: <GppMaybeIcon /> },
      {
        title: t('Nice to have'),
        data: data?.niceToHaves,
        icon: <TagFacesIcon />,
      },
      {
        title: t('Benefits and perks'),
        data: data?.benefits,
        icon: <MedicalInformationIcon />,
      },
    ],
    []
  )

  return (
    <>
      <Paper
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          p: 4,
          pb: 6,
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
        elevation={3}
      >
        <a
          href={employer?.employerProfile?.websiteUrl}
          rel="noreferrer"
          target="_blank"
        >
          <Avatar
            src={employer?.photo}
            alt={`${employer?.name} logo`}
            sx={{ width: 120, height: 120, cursor: 'pointer' }}
          />
        </a>
        <Stack direction="column" spacing={2}>
          <Typography variant="h5" fontWeight={600} color="secondary">
            {data?.positionName}
          </Typography>
          <Typography
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            variant="body1"
            color="text.secondary"
          >
            <EscalatorIcon /> {t('Experience Level')}:{' '}
            <Typography component="span" fontWeight={600}>
              {data?.experienceLevel &&
                data.experienceLevel.charAt(0).toUpperCase() +
                  data.experienceLevel.slice(1)}
            </Typography>
          </Typography>
          <Typography
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            variant="body1"
            color="text.secondary"
          >
            <ConstructionIcon /> {t('Category')}:{' '}
            <Typography component="span" fontWeight={600}>
              {data?.category &&
                data.category.charAt(0).toUpperCase() + data.category.slice(1)}
            </Typography>
          </Typography>
        </Stack>
      </Paper>
      <Paper
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4, mt: 3 }}
        elevation={3}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            {t('About')} {employer?.name}
          </Typography>
          <Link
            href={employer?.employerProfile?.linkedInProfile}
            color="inherit"
            target="_blank"
          >
            <LinkedInIcon sx={{ width: 24, height: 24 }} />
          </Link>
        </Stack>
        <Divider />
        <Typography variant="body1">
          {employer?.employerProfile?.bio}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <GroupsIcon /> {t('Company Size')}:{' '}
          <Typography component="span" fontWeight={600}>
            {companySizeObj[employer?.employerProfile?.companySize!]}
          </Typography>
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ApartmentIcon /> {t('Company Type')}:{' '}
          <Typography component="span" fontWeight={600}>
            {companyTypeObj[employer?.employerProfile?.companyType!]}
          </Typography>
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ScheduleIcon /> {t('Founded in')}:{' '}
          <Typography component="span" fontWeight={600}>
            {employer?.employerProfile?.foundedIn}
          </Typography>
        </Typography>

        <Divider />

        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={600}>
            {t('About job')}
          </Typography>
          {detailsList.map(({ title, data, icon }) => (
            <DetailsList key={title} title={title} data={data} icon={icon} />
          ))}
        </Stack>
      </Paper>
    </>
  )
}

export default OfferDescription
