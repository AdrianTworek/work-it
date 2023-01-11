import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetOfferStatsQuery } from '../../services/api/offerApi'
import { IOffer } from '../../services/api/types'

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import RankingRow from './RankingRow'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  offer: IOffer
}

const RankingModal = ({ open, setOpen, offer }: Props) => {
  const { t } = useTranslation(['dashboard'])
  const theme = useTheme()
  const { data, isLoading, error, refetch } = useGetOfferStatsQuery(offer.id)

  useEffect(() => {
    refetch()
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h4" component="span" textAlign="center">
          {t('Ranking')}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress color="info" />
          </Box>
        ) : (
          <Stack spacing={3}>
            {data &&
              data.map((application, idx) => (
                <RankingRow
                  key={application?.id}
                  data={application}
                  position={idx + 1}
                />
              ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button autoFocus color="inherit" onClick={handleClose}>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RankingModal
