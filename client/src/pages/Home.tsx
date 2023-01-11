import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useGetAllOffersQuery } from '../features/dashboard/services/api/offerApi'

import {
  Stack,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'

import { OfferCard, Pagination, OfferFiltering } from '../features'

const ROWS_PER_PAGE = 10

const Home = () => {
  const { t } = useTranslation(['home'])
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE)
  const [sortBy, setSortBy] = useState('newest')
  const location = useLocation()
  const isFiltering = useMemo(() => !!location, [location])

  const { data, isLoading, isFetching, error } = useGetAllOffersQuery({
    skip: page * ROWS_PER_PAGE,
    take: rowsPerPage,
    query: searchParams.get('query') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    category: searchParams.get('category') || 'all',
    experienceLevel: searchParams.get('experienceLevel') || 'all',
    isRemote: searchParams.get('isRemote') === 'true' ? true : false,
    companySize: searchParams.get('companySize') || 'all',
    companyType: searchParams.get('companyType') || 'all',
    salaryFrom: parseInt(searchParams.get('salaryFrom') as string) || 0,
    salaryTo: parseInt(searchParams.get('salaryTo') as string) || 100000,
    agreementType: searchParams.get('agreementType') || 'all',
  })

  const offers = data?.offers
  const offersCount = data?.offersCount
  const totalOffers = isFiltering ? offersCount : data?.totalOffers

  useEffect(() => {
    setPage(0)
  }, [searchParams])

  const handleChangeSortBy = (e: SelectChangeEvent) => {
    const { value } = e.target
    setSortBy(value)
    searchParams.set('sortBy', value)
    setSearchParams(searchParams)
  }

  return (
    <Stack
      spacing={2}
      sx={{
        maxWidth: 1000,
        mt: 3,
        mx: 'auto',
        px: 1,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <OfferFiltering />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight="600">
              {t('All offers')}: {totalOffers}
            </Typography>

            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="select-small">{t('Sort by')}</InputLabel>
              <Select
                labelId="select-small"
                id="select-small"
                value={sortBy}
                label={t('Sort by')}
                onChange={handleChangeSortBy}
              >
                <MenuItem value="newest">{t('Newest')}</MenuItem>
                <MenuItem value="oldest">{t('Oldest')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {isFetching ? (
            <CircularProgress />
          ) : (
            offers?.map((offer) => <OfferCard key={offer.id} offer={offer} />)
          )}

          {offers && (
            <Pagination
              totalOffers={totalOffers || 0}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
            />
          )}
        </>
      )}
    </Stack>
  )
}

export default Home
