import { IApplication } from '../features/dashboard/services/api/types'

const useCalculateMatches = (application: IApplication | undefined) => {
  const offer = application?.offer
  const preferences = application?.candidate.preferences
  const employer = application?.offer.employer
  const candidate = application?.candidate

  const matchCategory =
    preferences?.category === offer?.category ? 'primary' : 'error'
  const matchExperienceLevel =
    candidate?.candidateProfile?.experienceLevel === offer?.experienceLevel
      ? 'primary'
      : 'error'
  const matchCompanySize =
    preferences?.companySize === employer?.employerProfile?.companySize
      ? 'primary'
      : 'error'
  const matchCompanyType =
    preferences?.companyType === employer?.employerProfile?.companyType
      ? 'primary'
      : 'error'
  const matchLocation =
    preferences?.isRemote === offer?.isRemote ? 'primary' : 'error'
  const matchAgreementType =
    preferences?.agreementType === offer?.agreementType ? 'primary' : 'error'

  const score = [
    matchCategory,
    matchExperienceLevel,
    matchCompanySize,
    matchCompanyType,
    matchLocation,
    matchAgreementType,
  ].reduce((acc, curr) => (curr === 'primary' ? acc + 1 : acc), 0)

  return {
    offer,
    preferences,
    employer,
    candidate,
    matchCategory,
    matchExperienceLevel,
    matchCompanySize,
    matchCompanyType,
    matchLocation,
    matchAgreementType,
    score,
  }
}

export default useCalculateMatches
