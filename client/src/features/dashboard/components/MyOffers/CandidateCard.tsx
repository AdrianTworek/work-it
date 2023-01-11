import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Moment from 'react-moment'
import { IApplication } from '../../services/api/types'

import { Avatar, Paper, Typography } from '@mui/material'

type Props = {
  application: IApplication
}

const CandidateCard = ({ application }: Props) => {
  const { t, i18n } = useTranslation(['dashboard'])
  const navigate = useNavigate()

  return (
    <Paper
      elevation={5}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: ' center',
        gap: 1,
        p: 2,
        cursor: 'pointer',
      }}
      onClick={() =>
        navigate(
          `/employer/dashboard/offers/${application.offerId}/apps/${application.id}`
        )
      }
    >
      <Avatar
        src={application.candidate.photo || ''}
        sx={{ width: 80, height: 80 }}
      />
      <Typography variant="body1">{application.candidate.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('dashboard:Applied')}:{' '}
        <Moment fromNow locale={i18n.language}>
          {application.createdAt}
        </Moment>
      </Typography>
    </Paper>
  )
}

export default CandidateCard
