import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAllCandidatesQuery } from '../../services/api/offerApi'

import { CircularProgress, Grid, Stack, Typography } from '@mui/material'

import FileOpenIcon from '@mui/icons-material/FileOpen'

import CandidateCard from '../MyOffers/CandidateCard'
import SearchCandidate from './SearchCandidate'

const Candidates = () => {
  const { t } = useTranslation(['dashboard'])
  const [search, setSearch] = useState('')
  const { data, isLoading, error, refetch } = useGetAllCandidatesQuery()
  const filteredCandidates = useMemo(
    () =>
      data?.filter((candidate) =>
        candidate.candidate.name.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  )

  return (
    <Stack>
      <Typography variant="h4">{t('dashboard:Candidates')}</Typography>
      <Typography variant="h6" color="text.secondary" mt={1} mb={3}>
        {t('dashboard:HereYouCanViewAllOfTheCandidates')}
      </Typography>

      <SearchCandidate search={search} setSearch={setSearch} />

      <Typography variant="body1" mb={2}>
        {t('dashboard:AllCandidates')}: {filteredCandidates?.length}
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {filteredCandidates?.map((application) => (
            <Grid
              sx={{ position: 'relative' }}
              key={application.id}
              item
              xs={12}
              sm={6}
              md={4}
            >
              <CandidateCard application={application} />

              <Typography variant="body1">
                <a
                  href={application?.candidate?.candidateProfile?.cv}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    textDecoration: 'none',
                    color: '#0ea5e9',
                  }}
                >
                  <FileOpenIcon /> CV
                </a>
              </Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}

export default Candidates
