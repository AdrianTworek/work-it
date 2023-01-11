import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../store'
import { selectUser } from '../../../authentication/services/slices/userSlice'
import { ExperienceLevelEnum } from '../../../authentication/services/api/types'
import { useCreateOfferMutation } from '../../services/api/offerApi'

import { Box, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import AddIcon from '@mui/icons-material/Add'
import PaidIcon from '@mui/icons-material/Paid'
import HandshakeIcon from '@mui/icons-material/Handshake'
import ConstructionIcon from '@mui/icons-material/Construction'
import EscalatorIcon from '@mui/icons-material/Escalator'
import PersonIcon from '@mui/icons-material/Person'
import PlaceIcon from '@mui/icons-material/Place'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import TagFacesIcon from '@mui/icons-material/TagFaces'

import AgreementType, {
  AgreementTypeEnum,
} from '../../../../components/AgreementType'
import {
  ExperienceLevel,
  PaperWrapper,
  SalaryRange,
} from '../../../../components'
import PositionName from './PositionName'
import Location from './Location'
import Category, { CategoryEnum } from '../../../../components/Category'
import OfferDetailsInput from './OfferDetailsInput'

const OfferCreator = () => {
  const { t } = useTranslation(['dashboard'])
  const user = useAppSelector(selectUser)
  const [category, setCategory] = useState(CategoryEnum.FULLSTACK)
  const [experienceLevel, setExperienceLevel] = useState<
    ExperienceLevelEnum | undefined
  >(ExperienceLevelEnum.JUNIOR)
  const [positionName, setPositionName] = useState('')
  const [isRemote, setIsRemote] = useState(false)
  const [location, setLocation] = useState('')
  const [responsibilities, setResponibilities] = useState<string[]>([
    t('YouWillBeDeliveringHighQualitySoftware'),
  ])
  const [mustHaves, setMustHaves] = useState<string[]>(['React'])
  const [niceToHaves, setNiceToHaves] = useState<string[]>(['English'])
  const [benefits, setBenefits] = useState<string[]>([t('FreeParkingSpace')])
  const [salaryRange, setSalaryRange] = useState<number[]>([0, 100000])
  const [agreementType, setAgreementType] = useState(AgreementTypeEnum.B2B)

  const navigate = useNavigate()

  const [createOffer, { isLoading, isSuccess, error, isError }] =
    useCreateOfferMutation()

  useEffect(() => {
    if (!user?.employerProfile?.canCreateOffer) {
      navigate('/employer/dashboard/profile')
    }
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    createOffer({
      category,
      experienceLevel,
      positionName,
      isRemote,
      location,
      responsibilities,
      mustHaves,
      niceToHaves,
      benefits,
      salaryFrom: salaryRange[0],
      salaryTo: salaryRange[1],
      agreementType,
    })

    navigate('/dashboard')
  }

  return (
    <Stack>
      <Typography variant="h4">{t('OfferCreator')}</Typography>
      <Typography variant="h6" color="text.secondary" mt={1}>
        {t('FillNecessaryInformationAboutTheJob')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <PaperWrapper
          icon={<ConstructionIcon sx={{ width: 32, height: 32 }} />}
          title={t('WhatIsTheCategory')}
        >
          <Category category={category} setCategory={setCategory} />
        </PaperWrapper>

        <PaperWrapper
          icon={<EscalatorIcon sx={{ width: 32, height: 32 }} />}
          title={t('WhatIsTheExperienceLevel')}
        >
          <ExperienceLevel
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<PersonIcon sx={{ width: 32, height: 32 }} />}
          title={t('WhatIsThePositionName')}
        >
          <PositionName
            positionName={positionName}
            setPositionName={setPositionName}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<PlaceIcon sx={{ width: 32, height: 32 }} />}
          title={t('WhatIsTheLocation')}
        >
          <Location
            isRemote={isRemote}
            setIsRemote={setIsRemote}
            location={location}
            setLocation={setLocation}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<PlaylistAddCheckIcon sx={{ width: 32, height: 32 }} />}
          title={t('AddCandidateResponsibilities')}
        >
          <OfferDetailsInput
            initialState={[t('YouWillBeDeliveringHighQualitySoftware')]}
            tags={responsibilities}
            setTags={setResponibilities}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<GppMaybeIcon sx={{ width: 32, height: 32 }} />}
          title={t('AddMustHaveRequirements')}
        >
          <OfferDetailsInput
            initialState={['React']}
            tags={mustHaves}
            setTags={setMustHaves}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<TagFacesIcon sx={{ width: 32, height: 32 }} />}
          title={t('AddNiceToHaveSkills')}
        >
          <OfferDetailsInput
            initialState={['English']}
            tags={niceToHaves}
            setTags={setNiceToHaves}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<MedicalInformationIcon sx={{ width: 32, height: 32 }} />}
          title={t('AddBenefitsAndPerks')}
        >
          <OfferDetailsInput
            initialState={[t('FreeParkingSpace')]}
            tags={benefits}
            setTags={setBenefits}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<PaidIcon sx={{ width: 32, height: 32 }} />}
          title={t('WhatIsTheMonthlySalaryRange')}
        >
          <SalaryRange
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<HandshakeIcon sx={{ width: 32, height: 32 }} />}
          title={t('WhatIsTheTypeOfAgreement')}
        >
          <AgreementType
            agreementType={agreementType}
            setAgreementType={setAgreementType}
          />
        </PaperWrapper>

        <LoadingButton
          type="submit"
          size="large"
          variant="contained"
          sx={{ mt: 3 }}
          loading={isLoading}
        >
          <AddIcon sx={{ mr: 0.5 }} /> {t('CreateOffer')}
        </LoadingButton>
      </Box>
    </Stack>
  )
}

export default OfferCreator
