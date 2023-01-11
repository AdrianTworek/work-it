import { Dispatch, Fragment, memo, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { CompanyTypeEnum } from '../features/authentication/services/api/types'

import { Button, Stack } from '@mui/material'

export const companyTypeObj = {
  all: 'all',
  startup: 'STARTUP',
  softwareHouse: 'SOFTWARE HOUSE',
  rd: 'R&D',
  ecommerce: 'E-COMMERCE',
}

type Props = {
  companyType: CompanyTypeEnum | undefined
  setCompanyType: Dispatch<SetStateAction<CompanyTypeEnum | undefined>>
  small?: boolean
  isAll?: boolean
}

const CompanyType = memo(
  ({ companyType, setCompanyType, small, isAll }: Props) => {
    const { t } = useTranslation(['common'])

    return (
      <Stack direction="row" sx={{ gap: 2 }} flexWrap="wrap">
        {Object.entries(CompanyTypeEnum).map(([key, value]) => (
          <Fragment key={key}>
            {!isAll && value === 'all' ? null : (
              <Button
                variant={`${companyType === value ? 'contained' : 'outlined'}`}
                color="secondary"
                size="medium"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  minWidth: small ? 80 : 110,
                  height: small ? 40 : 80,
                }}
                onClick={() => setCompanyType(value)}
              >
                <span>{t(companyTypeObj[value])}</span>
              </Button>
            )}
          </Fragment>
        ))}
      </Stack>
    )
  }
)

export default CompanyType
