import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';
import Moment from 'react-moment';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../../authentication/services/slices/userSlice';
import { useAppSelector } from '../../../../store';
import {
  useDeleteOfferMutation,
  useUpdateOfferMutation,
} from '../../services/api/offerApi';
import { IOffer } from '../../services/api/types';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Delete } from '@mui/icons-material';

import CandidateCard from './CandidateCard';
import RecruitmentSteps from './RecruitmentSteps';
import RankingModal from './RankingModal';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';

type Props = {
  offer: IOffer;
};

const OfferCard = ({ offer }: Props) => {
  const { t, i18n } = useTranslation(['dashboard']);
  const [openRankingModal, setOpenRankingModal] = useState(false);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const [deleteOffer] = useDeleteOfferMutation();
  const [updateOffer] = useUpdateOfferMutation();

  const handleDeleteOffer = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      deleteOffer({ offerId: offer.id });
    },
    [offer]
  );

  const handleChangeOfferStatus = (
    e: ChangeEvent<HTMLInputElement>,
    newValue: boolean
  ) => {
    updateOffer({ id: offer.id, isVisible: newValue });
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ position: 'relative' }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user?.photo || ''} sx={{ width: 60, height: 60 }} />
            <Stack spacing={1}>
              <Typography
                variant="h6"
                color="secondary"
                sx={{ fontWeight: 600 }}
              >
                {offer.positionName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('Created')}:{' '}
                <Moment fromNow locale={i18n.language}>
                  {offer.createdAt}
                </Moment>
              </Typography>
            </Stack>
          </Stack>

          <Tooltip title={t('DeleteThisOffer')!} arrow placement="top">
            <IconButton
              color="error"
              sx={{ position: 'absolute', right: 8, top: -20 }}
              onClick={handleDeleteOffer}
            >
              <Delete color="inherit" />
            </IconButton>
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails>
          <Divider />
          <Stack mt={3} spacing={2}>
            <Button
              size="small"
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
              onClick={() => navigate(`/offers/${offer.id}`)}
            >
              {t('SeeOfferDetails')}
            </Button>

            <FormGroup sx={{ width: 'min-content' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={offer.isVisible}
                    onChange={handleChangeOfferStatus}
                    color="info"
                  />
                }
                label={t('Visible')}
              />
            </FormGroup>

            <Typography color="text.secondary">
              {t('Date')}: <Moment date={offer.createdAt} format="DD/MM/YYYY" />
            </Typography>

            <Divider />

            <RecruitmentSteps offer={offer} />

            <Divider />

            <Stack direction="row" spacing={2}>
              <Typography variant="h6">
                {t('Candidates')} ({offer?.applications?.length})
              </Typography>
              <Button
                color="info"
                variant="contained"
                size="small"
                sx={{ alignSelf: 'flex-start' }}
                onClick={() => setOpenRankingModal(true)}
              >
                {t('Ranking')}
              </Button>
            </Stack>

            <Grid container spacing={2}>
              {offer.applications?.map((application) => (
                <Grid key={application.id} item>
                  <CandidateCard application={application} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {openRankingModal && (
        <RankingModal
          open={openRankingModal}
          setOpen={setOpenRankingModal}
          offer={offer}
        />
      )}
    </>
  );
};

export default OfferCard;
