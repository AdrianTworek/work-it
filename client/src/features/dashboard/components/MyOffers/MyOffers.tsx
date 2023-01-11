import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllEmployerOffersQuery } from '../../services/api/offerApi';

import { CircularProgress, Grid, Stack, Typography } from '@mui/material';

import OfferCard from './OfferCard';

const MyOffers = () => {
  const { t } = useTranslation(['dashboard']);
  const { data, isLoading, error, refetch } = useGetAllEmployerOffersQuery();

  useEffect(() => {
    refetch();
  }, [data]);

  return (
    <Stack>
      <Typography variant="h4">{t('MyOffers')}</Typography>
      <Typography variant="h6" color="text.secondary" mt={1} mb={3}>
        {t('HereYouCanViewAndManageYourOffers')}
      </Typography>

      {data?.length === 0 && (
        <Typography variant="h5">{t('YouHaventCreatedOffer')}</Typography>
      )}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {data?.map((offer) => (
            <Grid key={offer.id} item xs={12}>
              <OfferCard offer={offer} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default MyOffers;
