import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetApplicationQuery } from '../../../services/api/applicationApi'

import {
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

import CandidateDetailsCard from './CandidateDetailsCard'
import CandidateDetailsButtons from './CandidateDetailsButtons'
import Ratings from './Ratings'

const getApplicationId = (pathname: string) =>
  pathname.substring(pathname.indexOf('apps') + 5)

const CandidateDetails = () => {
  const { t } = useTranslation(['dashboard'])
  const navigate = useNavigate()
  const location = useLocation()
  const id = useMemo(
    () => getApplicationId(location.pathname),
    [location.pathname]
  )

  const { data, isLoading, error, refetch } = useGetApplicationQuery({ id })

  useEffect(() => {
    refetch()
  }, [data])

  const goBack = useCallback(() => {
    navigate(-1)
  }, [])

  if (isLoading) return <CircularProgress />
  if (error)
    return <Typography variant="h5">{t('ApplicationNotFound')}</Typography>

  return (
    <Stack spacing={3}>
      <Button
        color="secondary"
        size="small"
        variant="outlined"
        onClick={goBack}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('GoBack')}
      </Button>

      <Divider />

      <Typography variant="h5" color="text.secondary">
        {data?.candidate.name.split(' ')[0]} {t('IsApplyingFor')}{' '}
        {data?.offer.positionName}
      </Typography>

      {<CandidateDetailsButtons application={data} />}

      <Divider />
      <Ratings application={data} />
      <Divider />

      <CandidateDetailsCard application={data} isLoading={isLoading} />
    </Stack>
  )
}

export default CandidateDetails
