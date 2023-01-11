import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Moment from 'react-moment'
import { useDeleteApplicationMutation } from '../../services/api/applicationApi'
import { IApplication } from '../../services/api/types'

import { Button, Stack, Typography } from '@mui/material'

import OfferCard from '../../../home/components/OfferCard'
import FeedbackMessageDialog from './FeedbackMessageDialog'
import { useSearchParams } from 'react-router-dom'

type Props = {
  application: IApplication
}

const ApplicationCard = ({ application }: Props) => {
  const { t, i18n } = useTranslation(['dashboard'])
  const [open, setOpen] = useState(false)
  const [deleteApplication] = useDeleteApplicationMutation()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('applicationId') === application.id) {
      setOpen(true)
    }
  }, [searchParams])

  const handleDeleteApplication = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      deleteApplication({ applicationId: application.id })
    },
    [application]
  )

  return (
    <Stack spacing={1}>
      <Typography color="text.secondary">
        {t('dashboard:Applied')}:{' '}
        <Moment fromNow locale={i18n.language}>
          {application.createdAt}
        </Moment>
      </Typography>

      {!!application?.feedback && (
        <>
          <Button
            size="small"
            variant="contained"
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => setOpen(true)}
          >
            {t('dashboard:ReadFeedback')}
          </Button>

          <FeedbackMessageDialog
            open={open}
            setOpen={setOpen}
            title={`Feedback ${t('dashboard:ForOffer')}: ${
              application.offer.positionName
            } ${t('dashboard:By')} ${application.offer.employer.name}`}
            message={application?.feedback}
          />
        </>
      )}

      <OfferCard
        offer={application.offer}
        application
        handleDeleteApplication={handleDeleteApplication}
      />
    </Stack>
  )
}

export default ApplicationCard
