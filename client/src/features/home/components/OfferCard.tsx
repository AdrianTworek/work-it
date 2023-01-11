import { memo, MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IOffer } from '../../dashboard/services/api/types';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  addToFavorites,
  deleteFromFavorites,
  selectFavoriteOffers,
} from '../services/slices/favoriteOffersSlice';

import {
  Avatar,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import PlaceIcon from '@mui/icons-material/Place';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

type Props = {
  offer: IOffer;
  application?: boolean;
  handleDeleteApplication?: (e: MouseEvent) => void;
};

const OfferCard = memo(
  ({ offer, application, handleDeleteApplication }: Props) => {
    const { employer } = offer;

    const { t } = useTranslation(['dashboard']);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const favorites = useAppSelector(selectFavoriteOffers);
    const [isFavorite, setIsFavorite] = useState(
      () => favorites.findIndex((el) => el.id === offer.id) >= 0
    );

    const handleAddToFavorites = (e: any) => {
      e.stopPropagation();

      if (isFavorite) {
        setIsFavorite(false);
        dispatch(deleteFromFavorites(offer));
      } else {
        setIsFavorite(true);
        dispatch(addToFavorites(offer));
      }
    };

    return (
      <Paper
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        elevation={4}
        onClick={() => navigate(`/offers/${offer.id}`)}
      >
        <Avatar
          sx={{ width: 60, height: 60 }}
          src={employer.photo}
          alt={`${employer.name} logo`}
        />

        <Stack sx={{ mr: 'auto' }}>
          <Typography>{offer.positionName}</Typography>
          <Typography
            sx={{ fontSize: '16px', display: { xs: 'flex', sm: 'none' } }}
            color="#10b981"
          >
            {offer.salaryFrom} - {offer.salaryTo} PLN
          </Typography>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {employer.name}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              color={offer.isRemote ? 'secondary' : 'inherit'}
            >
              <PlaceIcon sx={{ width: 16, height: 16 }} />{' '}
              {offer.isRemote ? 'Remote' : offer.location}
            </Typography>
          </Stack>
        </Stack>

        <Stack sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Typography sx={{ fontSize: '18px', mb: 1 }} color="#10b981">
            {offer.salaryFrom} - {offer.salaryTo} PLN
          </Typography>
          <Chip
            sx={{ ml: 'auto', maxWidth: 'min-content' }}
            label={offer.category}
          />
        </Stack>

        {isFavorite ? (
          <IconButton onClick={handleAddToFavorites}>
            <FavoriteIcon sx={{ color: '#db2777' }} />
          </IconButton>
        ) : (
          <IconButton onClick={handleAddToFavorites}>
            <FavoriteBorderIcon sx={{ color: '#db2777' }} />
          </IconButton>
        )}

        {application && (
          <Tooltip title={t('CancelYourApplication')!} arrow placement="top">
            <IconButton
              color="error"
              sx={{ position: 'absolute', right: 16, top: -20 }}
              onClick={handleDeleteApplication}
            >
              <Delete color="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </Paper>
    );
  }
);

export default OfferCard;
