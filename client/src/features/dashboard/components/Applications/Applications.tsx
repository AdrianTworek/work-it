import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetAllCandidateApplicationsQuery } from '../../services/api/applicationApi'

import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'

import ApplicationCard from './ApplicationCard'

const Applications = () => {
  const { t } = useTranslation(['dashboard'])
  const { data, isLoading, error, refetch } =
    useGetAllCandidateApplicationsQuery()
  const navigate = useNavigate()

  useEffect(() => {
    refetch()
  }, [])

  return (
    <Stack>
      <Typography variant="h4">{t('dashboard:MyApplications')}</Typography>
      <Typography variant="h6" color="text.secondary" mt={1} mb={3}>
        {t('dashboard:HereYouCanViewTheOffers')}
      </Typography>

      {!data?.length && !isLoading && (
        <Stack spacing={2}>
          <Typography variant="h5">
            {t('dashboard:YouHaventApplied')}
          </Typography>
          <Button
            variant="contained"
            color="info"
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => navigate('/')}
          >
            {t('dashboard:SearchOffers')}
          </Button>
        </Stack>
      )}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {data?.map((application) => (
            <Grid key={application.id} item xs={12}>
              <ApplicationCard application={application} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}

export default Applications
