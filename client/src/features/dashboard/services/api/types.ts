import {
  ExperienceLevelEnum,
  IUser,
} from '../../../authentication/services/api/types'
import { AgreementTypeEnum } from '../../../../components/AgreementType'

export interface IOffer {
  id: string
  employerId: string
  isVisible: boolean
  category: string
  experienceLevel: ExperienceLevelEnum
  positionName: string
  location?: string
  isRemote?: boolean
  responsibilities: string[]
  mustHaves: string[]
  niceToHaves: string[]
  benefits: string[]
  salaryFrom: number
  salaryTo: number
  agreementType: AgreementTypeEnum
  employer: IUser
  applications?: IApplication[]
  recruitmentSteps?: IRecruitmentStep[]
  createdAt: Date
  updatedAt: Date
}

export interface IOfferUpdate {
  id: string
  isVisible: boolean
}

export interface IOfferFilters {
  skip?: number
  take?: number
  query?: string
  sortBy?: string
  category?: string
  experienceLevel?: string
  isRemote?: boolean
  companySize?: string
  companyType?: string
  salaryFrom?: number
  salaryTo?: number
  agreementType?: string
}

export interface IRecruitmentStep {
  id: string
  offerId: string
  name: string
  importanceLevel: number
  offer: IOffer
  ratings?: IRating[]
}

export interface IApplication {
  id: string
  candidateId: string
  offerId: string
  feedback?: string
  candidate: IUser
  offer: IOffer
  ratings?: IRating[]
  createdAt: Date
  updatedAt: Date
}

export interface IRating {
  id: string
  applicationId: string
  recruitmentStepId: string
  grade: number
  application: IApplication
  recruitmentStep: IRecruitmentStep
}

export interface IApplicationUpdate {
  id: string
  feedback: string
}
