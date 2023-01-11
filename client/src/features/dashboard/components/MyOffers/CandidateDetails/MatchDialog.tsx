import { Dispatch, SetStateAction, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { IApplication } from '../../../services/api/types'
import useCalculateMatches from '../../../../../hooks/useCalculateMatches'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { companySizeObj } from '../../../../../components/CompanySize'
import { companyTypeObj } from '../../../../../components/CompanyType'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  application: IApplication | undefined
}

const MatchDialog = ({ open, setOpen, application }: Props) => {
  const { t } = useTranslation(['dashboard'])
  const theme = useTheme()
  const {
    preferences,
    candidate,
    matchCategory,
    matchExperienceLevel,
    matchCompanySize,
    matchCompanyType,
    matchLocation,
    matchAgreementType,
    score,
  } = useCalculateMatches(application)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h5" component="span" textAlign="center">
          {t('MatchUpWith', { name: candidate?.name })}
        </Typography>
        <Typography variant="h4" component="span" align="center">
          {Math.floor((score / 6) * 100)}%
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Stack spacing={2}>
          <Stack>
            <Typography color="text.secondary">{t('SalaryRange')}</Typography>
            <Typography>
              {preferences?.salaryFrom} - {preferences?.salaryTo} PLN
            </Typography>
          </Stack>
          <Stack>
            <Typography color="text.secondary">{t('Category')}</Typography>
            <Typography color={matchCategory}>
              {preferences?.category}
            </Typography>
          </Stack>
          <Stack>
            <Typography color="text.secondary">
              {t('ExperienceLevelLower')}
            </Typography>
            <Typography color={matchExperienceLevel}>
              {candidate?.candidateProfile?.experienceLevel?.toUpperCase()}
            </Typography>
          </Stack>
          <Stack>
            <Typography color="text.secondary">{t('CompanySize')}</Typography>
            {preferences?.companySize ? (
              <Typography color={matchCompanySize}>
                {companySizeObj[preferences?.companySize]}
              </Typography>
            ) : null}
          </Stack>
          <Stack>
            <Typography color="text.secondary">{t('CompanyType')}</Typography>
            {preferences?.companyType ? (
              <Typography color={matchCompanyType}>
                {companyTypeObj[preferences?.companyType]}
              </Typography>
            ) : null}
          </Stack>
          <Stack>
            <Typography color="text.secondary">{t('Location')}</Typography>
            <Typography color={matchLocation}>
              {preferences?.isRemote
                ? 'Remote'
                : candidate?.candidateProfile?.city}
            </Typography>
          </Stack>

          <Stack>
            <Typography color="text.secondary">{t('AgreementType')}</Typography>
            <Typography color={matchAgreementType}>
              {t(preferences?.agreementType?.toUpperCase() || '')}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="inherit" onClick={handleClose}>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MatchDialog
