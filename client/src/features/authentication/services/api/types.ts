import { AgreementTypeEnum } from '../../../../components/AgreementType'
import { CategoryEnum } from '../../../../components/Category'
import { RoleEnum } from '../../helpers/RequireUser'

export interface IUser {
  id: string
  email: string
  name: string
  photo?: string
  role: RoleEnum
  createdAt: Date
  updatedAt: Date
  candidateProfile?: ICandidateProfile
  employerProfile?: IEmployerProfile
  preferences?: IPreferences
}

export interface ICandidateProfile {
  id?: string
  candidateId?: string
  phoneNumber?: string
  city?: string
  bio?: string
  linkedInProfile?: string
  githubProfile?: string
  cv?: string
  experienceLevel?: ExperienceLevelEnum
}

export interface IEmployerProfile {
  id?: string
  employerId?: string
  phoneNumber?: string
  bio?: string
  address?: string
  foundedIn?: string
  linkedInProfile?: string
  websiteUrl?: string
  canCreateOffer?: boolean
  companySize?: CompanySizeEnum
  companyType?: CompanyTypeEnum
}

export interface IPreferences {
  id?: string
  userId?: string
  category?: CategoryEnum
  isRemote?: boolean
  companySize?: CompanySizeEnum
  companyType?: CompanyTypeEnum
  salaryFrom?: number
  salaryTo?: number
  agreementType?: AgreementTypeEnum
}

export interface IUserUpdate {
  id?: string | undefined
  name?: string
  photo?: string
  candidateProfile?: {
    update?: ICandidateProfile
  }
  employerProfile?: {
    update?: IEmployerProfile
  }
  preferences?: {
    update?: IPreferences
  }
}

export enum ExperienceLevelEnum {
  ALL = 'all',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
}

export enum CompanySizeEnum {
  ALL = 'all',
  SMALL = 'small',
  MEDIUM = 'medium',
  BIG = 'big',
  CORPORATION = 'corporation',
}

export enum CompanyTypeEnum {
  ALL = 'all',
  STARTUP = 'startup',
  SOFTWARE_HOUSE = 'softwareHouse',
  RESEARCH_AND_DEVELOPMENT = 'rd',
  ECOMMERCE = 'ecommerce',
}
