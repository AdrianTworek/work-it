import { Dispatch, Fragment, memo, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { CompanySizeEnum } from '../features/authentication/services/api/types'

import { Button, Stack } from '@mui/material'

export const companySizeObj = {
  all: '',
  small: '1-29',
  medium: '30-99',
  big: '100-249',
  corporation: '250+',
}

type Props = {
  companySize: CompanySizeEnum | undefined
  setCompanySize: Dispatch<SetStateAction<CompanySizeEnum | undefined>>
  small?: boolean
  isAll?: boolean
}

const CompanySize = memo(
  ({ companySize, setCompanySize, small, isAll }: Props) => {
    const { t } = useTranslation(['common'])

    return (
      <Stack direction="row" sx={{ gap: 2 }} flexWrap="wrap">
        {Object.entries(CompanySizeEnum).map(([key, value]) => (
          <Fragment key={key}>
            {!isAll && value === 'all' ? null : (
              <Button
                variant={`${companySize === value ? 'contained' : 'outlined'}`}
                color="secondary"
                size="medium"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  minWidth: small ? 80 : 110,
                  height: small ? 60 : 80,
                }}
                onClick={() => setCompanySize(value)}
              >
                <span>{t(value)}</span>
                <span>{companySizeObj[value]}</span>
              </Button>
            )}
          </Fragment>
        ))}
      </Stack>
    )
  }
)

export default CompanySize
