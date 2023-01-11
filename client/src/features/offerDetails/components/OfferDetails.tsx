import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useGetOfferQuery } from '../../dashboard/services/api/offerApi'

import { Box, CircularProgress, Grid, Typography } from '@mui/material'

import OfferDescription from './OfferDescription'
import ApplyInfo from './ApplyInfo'

const OfferDetails = () => {
  const { t } = useTranslation(['home'])
  const { offerId } = useParams()

  const { data, isLoading, error, refetch } = useGetOfferQuery(offerId!)

  const employer = data?.employer

  useEffect(() => {
    refetch()
  }, [data])

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ mt: 12 }} />
      </Box>
    )

  if (error)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h5" mt={3}>
          {t('OfferNotFound')}
        </Typography>
      </Box>
    )

  return (
    <Grid
      container
      alignItems="start"
      justifyContent="center"
      sx={{
        position: 'relative',
        maxWidth: 1140,
        mx: 'auto',
        mt: 8,
        px: 3,
        pb: 8,
      }}
    >
      <Grid item xs={12} md={7} m={1}>
        <OfferDescription data={data} employer={employer} />
      </Grid>
      <Grid item xs={12} md={4} m={1} sx={{ position: 'sticky', top: 80 }}>
        <ApplyInfo data={data} />
      </Grid>
    </Grid>
  )
}

export default OfferDetails
