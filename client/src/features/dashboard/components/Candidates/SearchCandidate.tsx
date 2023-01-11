import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { InputAdornment, TextField } from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'

type Props = {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
}

const SearchCandidate = ({ search, setSearch }: Props) => {
  const { t } = useTranslation(['dashboard'])

  return (
    <TextField
      sx={{ mb: 3 }}
      placeholder={t('dashboard:SearchForCandidate')!}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  )
}

export default SearchCandidate
