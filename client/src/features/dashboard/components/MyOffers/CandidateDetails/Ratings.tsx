import { useTranslation } from 'react-i18next'
import { IApplication } from '../../../services/api/types'
import { useCreateRatingMutation } from '../../../services/api/applicationApi'

import { Rating, Stack, Typography } from '@mui/material'

type Props = {
  application: IApplication | undefined
}

const Ratings = ({ application }: Props) => {
  const { t } = useTranslation(['dashboard'])
  const [createOrUpdateRating] = useCreateRatingMutation()

  const handleCreateOrUpdateRating = (
    recruitmentStepId: string,
    ratingId: string,
    grade: number | null
  ) => {
    createOrUpdateRating({
      offerId: application?.offer.id!,
      recruitmentStepId,
      applicationId: application?.id!,
      ratingId,
      grade: grade || 0,
    })
  }

  const content =
    application?.ratings?.length !==
    application?.offer?.recruitmentSteps?.length
      ? application?.offer?.recruitmentSteps?.map((step) => (
          <Stack key={step.id} direction="row" spacing={1}>
            <Typography color="text.secondary" noWrap>
              {step?.name}
            </Typography>
            <Rating
              name="half-rating"
              defaultValue={0}
              precision={0.5}
              max={5}
              onChange={(e, newValue) =>
                handleCreateOrUpdateRating(step.id, '1', newValue)
              }
            />
          </Stack>
        ))
      : application?.ratings?.map((rating) => (
          <Stack key={rating.id} direction="row" spacing={1}>
            <Typography color="text.secondary" noWrap>
              {rating?.recruitmentStep?.name}
            </Typography>
            <Rating
              name="half-rating"
              defaultValue={rating.grade}
              value={rating.grade}
              precision={0.5}
              max={5}
              onChange={(e, newValue) =>
                handleCreateOrUpdateRating(
                  rating.recruitmentStepId,
                  rating.id,
                  newValue
                )
              }
            />
          </Stack>
        ))

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t('Ratings')}</Typography>
      {content}
    </Stack>
  )
}

export default Ratings
