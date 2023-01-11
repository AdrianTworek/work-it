import { ChangeEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../../../store'
import { selectUser } from '../../authentication/services/slices/userSlice'
import { RoleEnum } from '../../authentication/helpers/RequireUser'
import { debounce } from 'lodash'

import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import ClearIcon from '@mui/icons-material/Clear'

import FilterByPreferencesButton from './FilterByPreferencesButton'
import FiltersModal from './FiltersModal'

const OfferFiltering = () => {
  const { t } = useTranslation(['home'])
  const user = useAppSelector(selectUser)
  const [searchParams, setSearchParams] = useSearchParams()
  const [openFiltersModal, setOpenFiltersModal] = useState(false)
  const [showClearFilters, setShowClearFilters] = useState(false)
  const navigate = useNavigate()

  const handleSearchInputChange = debounce(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target

      if (!value.length) {
        searchParams.delete('query')
        setSearchParams(searchParams, { replace: true })
      } else {
        searchParams.set('query', value)
        setSearchParams(searchParams, { replace: true })
      }
    },
    250
  )

  const handleFilterByPreferences = useCallback(() => {
    searchParams.set('category', user?.preferences?.category || '')
    searchParams.set(
      'experienceLevel',
      user?.candidateProfile?.experienceLevel || ''
    )
    searchParams.set('isRemote', user?.preferences?.isRemote ? 'true' : 'false')
    searchParams.set('companySize', user?.preferences?.companySize || 'all')
    searchParams.set('companyType', user?.preferences?.companyType || 'all')
    searchParams.set(
      'salaryFrom',
      user?.preferences?.salaryFrom?.toString() || ''
    )
    searchParams.set('salaryTo', user?.preferences?.salaryTo?.toString() || '')
    searchParams.set('agreementType', user?.preferences?.agreementType || 'all')
    setSearchParams(searchParams, { replace: true })
  }, [user])

  const handleClearFilters = useCallback(() => {
    navigate('/')
    setShowClearFilters(false)
  }, [])

  return (
    <Stack spacing={3} mt={4} mb={4} mx="auto" maxWidth={600} px={2}>
      <Typography variant="h4" textAlign="center">
        {t('Search for a job')}
      </Typography>

      <TextField
        placeholder={t('Position, location, company...') || ''}
        onChange={handleSearchInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="row" justifyContent="center" spacing={2}>
        <Button
          variant="outlined"
          color="info"
          size="large"
          startIcon={<TuneIcon />}
          sx={{ alignSelf: 'center' }}
          onClick={() => setOpenFiltersModal(true)}
        >
          {t('More filters')}
        </Button>

        {showClearFilters && (
          <Button
            variant="outlined"
            color="error"
            size="large"
            sx={{ alignSelf: 'center' }}
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
          >
            {t('Clear filters')}
          </Button>
        )}
      </Stack>

      {user && user.role === RoleEnum.CANDIDATE && (
        <>
          <Typography variant="body2" textAlign="center" color="secondary">
            {t('OR')}
          </Typography>

          <FilterByPreferencesButton
            handleFilterByPreferences={handleFilterByPreferences}
          />
        </>
      )}

      <FiltersModal
        open={openFiltersModal}
        setOpen={setOpenFiltersModal}
        setShowClearFilters={setShowClearFilters}
      />
    </Stack>
  )
}

export default OfferFiltering
