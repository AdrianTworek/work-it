import { Dispatch, memo, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { TextField } from '@mui/material'

type Props = {
  positionName: string
  setPositionName: Dispatch<SetStateAction<string>>
}

const PositionName = memo(({ positionName, setPositionName }: Props) => {
  const { t } = useTranslation(['dashboard'])

  return (
    <TextField
      fullWidth
      required
      color="secondary"
      label={t('PositionName')}
      placeholder={t('Front-EndDeveloper')!}
      value={positionName}
      onChange={(e) => setPositionName(e.target.value)}
    />
  )
})

export default PositionName
