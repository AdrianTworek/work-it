import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IApplication } from '../../../services/api/types'

import { Button, Stack } from '@mui/material'

import FeedbackDialog from './FeedbackDialog'
import MatchDialog from './MatchDialog'

type Props = {
  application: IApplication | undefined
}

const CandidateDetailsButtons = ({ application }: Props) => {
  const { t } = useTranslation(['dashboard'])
  const [open, setOpen] = useState(false)
  const [openMatch, setOpenMatch] = useState(false)

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          sx={{ alignSelf: 'flex-start' }}
          onClick={() => setOpen(true)}
          disabled={!!application?.feedback}
        >
          {t('SendFeedback')}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          sx={{ alignSelf: 'flex-start' }}
          onClick={() => setOpenMatch(true)}
        >
          {t('SeeMatch')}
        </Button>
      </Stack>

      <FeedbackDialog open={open} setOpen={setOpen} application={application} />
      <MatchDialog
        open={openMatch}
        setOpen={setOpenMatch}
        application={application}
      />
    </>
  )
}

export default CandidateDetailsButtons
