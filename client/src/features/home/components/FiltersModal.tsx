import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  CompanySizeEnum,
  CompanyTypeEnum,
  ExperienceLevelEnum,
} from '../../authentication/services/api/types';
import { CategoryEnum } from '../../../components/Category';
import AgreementType, {
  AgreementTypeEnum,
} from '../../../components/AgreementType';

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import {
  Category,
  CompanySize,
  CompanyType,
  ExperienceLevel,
  SalaryRange,
} from '../../../components';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setShowClearFilters: Dispatch<SetStateAction<boolean>>;
};

const FiltersModal = memo(({ open, setOpen, setShowClearFilters }: Props) => {
  const { t } = useTranslation(['common', 'home']);
  const [searchParams, setSearchParams] = useSearchParams();
  const [salaryRange, setSalaryRange] = useState<number[]>([0, 100000]);
  const [isRemote, setIsRemote] = useState(false);
  const [category, setCategory] = useState(CategoryEnum.ALL);
  const [experienceLevel, setExperienceLevel] = useState<
    ExperienceLevelEnum | undefined
  >(ExperienceLevelEnum.ALL);
  const [companySize, setCompanySize] = useState<CompanySizeEnum | undefined>(
    CompanySizeEnum.ALL
  );
  const [companyType, setCompanyType] = useState<CompanyTypeEnum | undefined>(
    CompanyTypeEnum.ALL
  );
  const [agreementType, setAgreementType] = useState<AgreementTypeEnum>(
    AgreementTypeEnum.ALL
  );

  const theme = useTheme();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSearch = () => {
    searchParams.set('salaryFrom', salaryRange[0].toString() || '0');
    searchParams.set('salaryTo', salaryRange[1].toString() || '100000');
    searchParams.set('isRemote', isRemote ? 'true' : 'false');
    searchParams.set('category', category || 'all');
    searchParams.set('experienceLevel', experienceLevel || 'all');
    searchParams.set('companySize', companySize || 'all');
    searchParams.set('companyType', companyType || 'all');
    searchParams.set('agreementType', agreementType || 'all');
    setSearchParams(searchParams, { replace: true });

    setShowClearFilters(true);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h4" component="p">
          {t('home:Filters')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1} mb={2}>
          <Typography>{t('home:Salary')}</Typography>
          <SalaryRange
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
          />
        </Stack>

        <Stack spacing={1} mb={2}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  value={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                />
              }
              label={t('common:Remote')}
            />
          </FormGroup>
        </Stack>

        <Stack spacing={1} mb={2}>
          <Typography>{t('Category')}</Typography>
          <Category category={category} setCategory={setCategory} isAll />
        </Stack>

        <Stack spacing={1} mb={2}>
          <Typography>{t('ExperienceLevel')}</Typography>
          <ExperienceLevel
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            small
            isAll
          />
        </Stack>

        <Stack spacing={1} mb={2}>
          <Typography>{t('Company Size')}</Typography>
          <CompanySize
            companySize={companySize}
            setCompanySize={setCompanySize}
            small
            isAll
          />
        </Stack>

        <Stack spacing={1} mb={2}>
          <Typography>{t('Company Type')}</Typography>
          <CompanyType
            companyType={companyType}
            setCompanyType={setCompanyType}
            small
            isAll
          />
        </Stack>

        <Stack spacing={1} mb={2}>
          <Typography>{t('Agreement Type')}</Typography>
          <AgreementType
            agreementType={agreementType}
            setAgreementType={setAgreementType}
            isAll
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="inherit" onClick={handleClose}>
          {t('Cancel')}
        </Button>
        <Button color="info" variant="contained" onClick={handleSearch}>
          {t('Search')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default FiltersModal;
