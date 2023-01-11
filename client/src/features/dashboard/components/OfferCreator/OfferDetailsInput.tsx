import { Dispatch, memo, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { Autocomplete, TextField } from '@mui/material'

type Props = {
  initialState: string[]
  tags: string[]
  setTags: Dispatch<SetStateAction<string[]>>
}

const OfferDetailsInput = memo(({ initialState, tags, setTags }: Props) => {
  const { t } = useTranslation(['dashboard'])

  return (
    <Autocomplete
      style={{ margin: '20px 0' }}
      fullWidth
      multiple
      id="tags-outlined"
      options={[]}
      defaultValue={[...initialState]}
      autoSelect
      freeSolo
      onChange={(e, newValues) => setTags(newValues)}
      renderInput={(params) => (
        <TextField
          required={!tags.length}
          {...params}
          color="secondary"
          label={t('AddByPressingEnter')}
        />
      )}
    />
  )
})

export default OfferDetailsInput
