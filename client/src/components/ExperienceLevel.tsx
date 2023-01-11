import { Dispatch, Fragment, memo, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { ExperienceLevelEnum } from '../features/authentication/services/api/types'

import { Button, Stack } from '@mui/material'

type Props = {
  experienceLevel: ExperienceLevelEnum | undefined
  setExperienceLevel: Dispatch<SetStateAction<ExperienceLevelEnum | undefined>>
  small?: boolean
  isAll?: boolean
}

const ExperienceLevel = memo(
  ({ experienceLevel, setExperienceLevel, small, isAll }: Props) => {
    const { t } = useTranslation(['common'])

    return (
      <Stack direction="row" spacing={1}>
        {Object.entries(ExperienceLevelEnum).map(([key, value]) => (
          <Fragment key={key}>
            {!isAll && value === 'all' ? null : (
              <Button
                variant={`${
                  experienceLevel === value ? 'contained' : 'outlined'
                }`}
                color="secondary"
                size="large"
                sx={{ maxWidth: 100, height: small ? 45 : 70 }}
                onClick={() => setExperienceLevel(value)}
              >
                {t(value)}
              </Button>
            )}
          </Fragment>
        ))}
      </Stack>
    )
  }
)

export default ExperienceLevel
