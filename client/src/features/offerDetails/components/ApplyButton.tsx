import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../store'
import { selectUser } from '../../authentication/services/slices/userSlice'
import { RoleEnum } from '../../authentication/helpers/RequireUser'
import { NotificationTypeEnum } from '../../notifications/services/api/types'
import { useCreateApplicationMutation } from '../../dashboard/services/api/applicationApi'
import { IOffer } from '../../dashboard/services/api/types'
import useShowToastNotification from '../../../hooks/useShowToastNotification'
import { useCreateNotificationMutation } from '../../notifications/services/api/notificationApi'
import { addNotification } from '../../notifications/services/slices/notificationsSlice'

import { Button, Tooltip } from '@mui/material'

import WarningIcon from '@mui/icons-material/Warning'
import { useSocketContext } from '../../../contexts/SocketContext'

type Props = {
  offer: Partial<IOffer> | undefined
}

const ApplyButton = ({ offer }: Props) => {
  const { t } = useTranslation(['common'])
  const { socket, sendNotification }: any = useSocketContext()
  const user = useAppSelector(selectUser)
  const [hasApplied, setHasApplied] = useState(
    offer?.applications?.some((el) => el.candidateId === user?.id)
  )

  const [createApplication, { isLoading, isSuccess, error, isError }] =
    useCreateApplicationMutation()
  const [createNotification] = useCreateNotificationMutation()

  const dispatch = useAppDispatch()

  useShowToastNotification({
    message: t('SuccessfullyAppliedForThatJob'),
    type: 'success',
    isLoading,
    isSuccess,
    error,
    isError,
  })

  const canApply =
    !hasApplied &&
    user &&
    user.role === RoleEnum.CANDIDATE &&
    user.candidateProfile?.cv

  const handleApply = async () => {
    if (offer?.id && offer.employerId && canApply) {
      const application = await createApplication({ offerId: offer.id })
      const notification = await createNotification({
        message: `${t('NewCandidateFor')} ${offer.positionName}`,
        type: NotificationTypeEnum.NEW_CANDIDATE,
        image: user.photo || '',
        // @ts-ignore
        redirectUrl: `/employer/dashboard/offers/${offer?.id}/apps/${application.data.id}`,
        recipientId: offer.employerId,
      })
      // @ts-ignore
      sendNotification(notification.data)
      setHasApplied(true)
    }
  }

  return (
    <Tooltip
      title={
        canApply
          ? ''
          : hasApplied
          ? t('You already applied for that job')!
          : t('Register as Candidate and upload your CV')!
      }
      placement="top"
    >
      <span>
        <Button
          color="info"
          variant="contained"
          size="large"
          fullWidth
          disabled={!canApply}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          onClick={handleApply}
        >
          {t('Apply')}
          {!canApply && (
            <WarningIcon sx={{ width: 20, height: 20, color: 'orange' }} />
          )}
        </Button>
      </span>
    </Tooltip>
  )
}

export default ApplyButton
