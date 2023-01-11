import { Dispatch, Fragment, memo, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { Chip, Stack } from '@mui/material'

export enum CategoryEnum {
  ALL = 'all',
  FULLSTACK = 'Full Stack',
  BACKEND = 'Backend',
  FRONTEND = 'Frontend',
  TESTING = 'Testing',
  DEVOPS = 'DevOps',
  MOBILE = 'Mobile',
  EMBEDDED = 'Embedded',
  BUSSINESS_INTELIGENCE = 'Business Inteligence',
  HR = 'HR',
  UIUX = 'UI & UX',
  PROJECT_MANAGER = 'Project Manager',
  SUPPORT = 'Support',
  DATA_SCIENCE = 'Data Science',
  OTHER = 'Other',
}

type Props = {
  category: CategoryEnum
  setCategory: Dispatch<SetStateAction<CategoryEnum>>
  isAll?: boolean
}

const Category = memo(({ category, setCategory, isAll }: Props) => {
  const { t } = useTranslation(['common'])

  return (
    <Stack direction="row" gap={1} rowGap={2} flexWrap="wrap">
      {Object.entries(CategoryEnum).map(([key, value]) => (
        <Fragment key={key}>
          {!isAll && value === 'all' ? null : (
            <Chip
              color="secondary"
              variant={category === value ? 'filled' : 'outlined'}
              label={t(value).toUpperCase()}
              onClick={() => setCategory(value)}
            />
          )}
        </Fragment>
      ))}
    </Stack>
  )
})

export default Category
