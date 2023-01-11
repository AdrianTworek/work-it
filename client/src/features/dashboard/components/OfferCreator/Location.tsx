import { Dispatch, memo, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox, FormControlLabel, TextField } from '@mui/material'

type Props = {
  isRemote: boolean
  setIsRemote: Dispatch<SetStateAction<boolean>>
  location: string
  setLocation: Dispatch<SetStateAction<string>>
}

const Location = memo(
  ({ isRemote, setIsRemote, location, setLocation }: Props) => {
    const { t } = useTranslation(['dashboard'])

    return (
      <>
        <TextField
          required={!isRemote}
          fullWidth
          color="secondary"
          label={t('City')}
          placeholder={t('Szczecin')!}
          disabled={isRemote}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="secondary"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
            />
          }
          label={t('Remote')}
        />
      </>
    )
  }
)

export default Location
