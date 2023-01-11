import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@mui/material'

type Props = {
  handleFilterByPreferences: () => void
}

const FilterByPreferencesButton = ({ handleFilterByPreferences }: Props) => {
  const { t } = useTranslation(['home'])
  const [hasFiltered, setHasFiltered] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <Button
        variant="contained"
        color="info"
        size="large"
        disabled={hasFiltered}
        sx={{ alignSelf: 'center' }}
        onClick={() => {
          handleFilterByPreferences()
          setHasFiltered(true)
        }}
      >
        {t('Filter by my preferences')}
      </Button>

      {hasFiltered && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ alignSelf: 'center' }}
          onClick={() => {
            setHasFiltered(false)
            navigate('/')
          }}
        >
          {t('Show all offers')}
        </Button>
      )}
    </>
  )
}

export default FilterByPreferencesButton
