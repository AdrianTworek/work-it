import { Dispatch, Fragment, memo, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { Chip, Stack } from '@mui/material'

export enum AgreementTypeEnum {
  ALL = 'all',
  B2B = 'b2b',
  PERMAMENT = 'permanent',
  MANDATE = 'mandate',
}

type Props = {
  agreementType: AgreementTypeEnum
  setAgreementType: Dispatch<SetStateAction<AgreementTypeEnum>>
  isAll?: boolean
}

const AgreementType = memo(
  ({ agreementType, setAgreementType, isAll }: Props) => {
    const { t } = useTranslation(['common'])

    return (
      <Stack direction="row" spacing={1}>
        {Object.entries(AgreementTypeEnum).map(([key, value]) => (
          <Fragment key={key}>
            {!isAll && value === 'all' ? null : (
              <Chip
                color="secondary"
                variant={agreementType === value ? 'filled' : 'outlined'}
                label={t(value).toUpperCase()}
                onClick={() => setAgreementType(value)}
              />
            )}
          </Fragment>
        ))}
      </Stack>
    )
  }
)

export default AgreementType
