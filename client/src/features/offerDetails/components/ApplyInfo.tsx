import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Moment from 'react-moment'
import { IOffer } from '../../dashboard/services/api/types'
import { useAppDispatch, useAppSelector } from '../../../store'
import {
  addToFavorites,
  deleteFromFavorites,
  selectFavoriteOffers,
} from '../../home/services/slices/favoriteOffersSlice'

import { Button, Divider, Paper, Stack, Typography } from '@mui/material'

import PlaceIcon from '@mui/icons-material/Place'
import EventIcon from '@mui/icons-material/Event'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

import ApplyButton from './ApplyButton'

type Props = {
  data: IOffer | undefined
}

const ApplyInfo = ({ data }: Props) => {
  const { t, i18n } = useTranslation(['common'])
  const favorites = useAppSelector(selectFavoriteOffers)
  const [isFavorite, setIsFavorite] = useState(
    () => favorites.findIndex((el) => el.id === data?.id) >= 0
  )
  const dispatch = useAppDispatch()

  const handleAddToFavorites = (e: any) => {
    e.stopPropagation()

    if (isFavorite) {
      setIsFavorite(false)
      dispatch(deleteFromFavorites(data!))
    } else {
      setIsFavorite(true)
      dispatch(addToFavorites(data!))
    }
  }

  const favoriteBtnIcon = isFavorite ? <RemoveIcon /> : <AddIcon />

  return (
    <>
      <Paper sx={{ p: 2 }} elevation={3}>
        <Stack spacing={2} alignItems="stretch">
          <Typography variant="h5" fontWeight={600} color="#10b981">
            {data?.salaryFrom.toLocaleString()} -{' '}
            {data?.salaryTo.toLocaleString()} PLN
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t(data?.agreementType || '').toUpperCase()} ({t('monthly')})
          </Typography>
          <Divider />
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PlaceIcon />
            {data?.location || t('Remote')}
          </Typography>

          <ApplyButton offer={data} />

          <Typography
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <EventIcon />{' '}
            <Moment fromNow locale={i18n.language}>
              {data?.createdAt}
            </Moment>
          </Typography>
        </Stack>
      </Paper>

      <Button
        color="inherit"
        variant="outlined"
        fullWidth
        sx={{ color: '#db2777', mt: 2 }}
        onClick={handleAddToFavorites}
      >
        {favoriteBtnIcon}
        {isFavorite ? t('Remove from favorites') : t('Add to favorites')}
      </Button>
    </>
  )
}

export default ApplyInfo
