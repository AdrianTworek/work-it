import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../store';
import { selectUser } from '../../../authentication/services/slices/userSlice';
import { useUpdateUserMutation } from '../../../authentication/services/api/userApi';
import {
  CompanySizeEnum,
  CompanyTypeEnum,
} from '../../../authentication/services/api/types';
import useShowToastNotification from '../../../../hooks/useShowToastNotification';

import { Box, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import PaidIcon from '@mui/icons-material/Paid';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ConstructionIcon from '@mui/icons-material/Construction';
import GroupsIcon from '@mui/icons-material/Groups';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PlaceIcon from '@mui/icons-material/Place';

import {
  AgreementType,
  Category,
  CompanySize,
  CompanyType,
  PaperWrapper,
  SalaryRange,
} from '../../../../components';
import { CategoryEnum } from '../../../../components/Category';
import { AgreementTypeEnum } from '../../../../components/AgreementType';
import RemoteWork from './RemoteWork';

const Preferences = () => {
  const { t } = useTranslation(['dashboard']);
  const user = useAppSelector(selectUser);
  const [category, setCategory] = useState(
    user?.preferences?.category || CategoryEnum.FULLSTACK
  );
  const [companySize, setCompanySize] = useState<CompanySizeEnum | undefined>(
    user?.preferences?.companySize || CompanySizeEnum.SMALL
  );
  const [companyType, setCompanyType] = useState<CompanyTypeEnum | undefined>(
    user?.preferences?.companyType || CompanyTypeEnum.STARTUP
  );
  const [isRemote, setIsRemote] = useState(
    user?.preferences?.isRemote || false
  );
  const [salaryRange, setSalaryRange] = useState<number[]>([
    user?.preferences?.salaryFrom || 0,
    user?.preferences?.salaryTo || 100000,
  ]);
  const [agreementType, setAgreementType] = useState(
    user?.preferences?.agreementType || AgreementTypeEnum.B2B
  );

  const [updateUser, { isLoading, isSuccess, error, isError }] =
    useUpdateUserMutation();

  useShowToastNotification({
    message: t('dashboard:YourPreferencesWereUpdated'),
    type: 'info',
    isLoading,
    isSuccess,
    error,
    isError,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    updateUser({
      id: user?.id,
      preferences: {
        update: {
          category,
          companySize,
          companyType,
          isRemote,
          salaryFrom: salaryRange[0],
          salaryTo: salaryRange[1],
          agreementType,
        },
      },
    });
  };

  return (
    <Stack>
      <Typography variant="h4">{t('Preferences')}</Typography>
      <Typography variant="h6" color="text.secondary" mt={1}>
        {t('ChooseYourPreferences')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <PaperWrapper
          icon={<ConstructionIcon sx={{ width: 32, height: 32 }} />}
          title={t('WhatIsTheMainField')}
        >
          <Category category={category} setCategory={setCategory} />
        </PaperWrapper>

        <PaperWrapper
          icon={<GroupsIcon sx={{ width: 32, height: 32 }} />}
          title={t('HowMuchPeopleWouldYouLike')}
        >
          <CompanySize
            companySize={companySize}
            setCompanySize={setCompanySize}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<ApartmentIcon sx={{ width: 32, height: 32 }} />}
          title={t('WhatKindOfCompany')}
        >
          <CompanyType
            companyType={companyType}
            setCompanyType={setCompanyType}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<PlaceIcon sx={{ width: 32, height: 32 }} />}
          title={t('WouldYouLikeToWorkRemotely')}
        >
          <RemoteWork isRemote={isRemote} setIsRemote={setIsRemote} />
        </PaperWrapper>

        <PaperWrapper
          icon={<PaidIcon sx={{ width: 32, height: 32 }} />}
          title={t('WhatAreYourMonthlySalaryExpectations')}
        >
          <SalaryRange
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
          />
        </PaperWrapper>

        <PaperWrapper
          icon={<HandshakeIcon sx={{ width: 32, height: 32 }} />}
          title={t('WhatIsYourPreferredTypeOfAgreement')}
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
          {t('Update')}
        </LoadingButton>
      </Box>
    </Stack>
  );
};

export default Preferences;
