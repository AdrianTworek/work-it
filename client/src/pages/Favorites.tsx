import { useAppSelector } from '../store'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { OfferCard } from '../features'
import { selectFavoriteOffers } from '../features/home/services/slices/favoriteOffersSlice'

import { Button, Stack, Typography } from '@mui/material'

const Favorites = () => {
  const { t } = useTranslation(['home'])
  const favorites = useAppSelector(selectFavoriteOffers)
  const navigate = useNavigate()

  return (
    <Stack
      spacing={2}
      sx={{
        maxWidth: 1000,
        mt: 3,
        mx: 'auto',
        px: 1,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {!favorites.length ? (
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center">
            {t("You haven't liked any offer yet.")}
          </Typography>
          <Button
            sx={{ alignSelf: 'center' }}
            variant="contained"
            color="info"
            onClick={() => navigate('/')}
          >
            {t('Search offers')}
          </Button>
        </Stack>
      ) : (
        <>
          <Typography variant="h6" fontWeight={600}>
            {t('Favorite offers')} ({favorites.length})
          </Typography>
          {favorites?.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </>
      )}
    </Stack>
  )
}

export default Favorites
