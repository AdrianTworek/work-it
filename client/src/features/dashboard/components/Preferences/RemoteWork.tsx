import { Dispatch, memo, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox, FormControlLabel } from '@mui/material'

type Props = {
  isRemote: boolean
  setIsRemote: Dispatch<SetStateAction<boolean>>
}

const RemoteWork = memo(({ isRemote, setIsRemote }: Props) => {
  const { t } = useTranslation(['dashboard'])

  return (
    <FormControlLabel
      control={
        <Checkbox
          color="secondary"
          checked={isRemote}
          onChange={(e) => setIsRemote(e.target.checked)}
        />
      }
      label={t('Yes')}
    />
  )
})

export default RemoteWork
