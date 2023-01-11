import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

const ChangeLanguage = () => {
  const { i18n, t } = useTranslation(['common']);
  const [language, setLanguage] = useState('second');

  const handleLanguageChange = (e: SelectChangeEvent) => {
    const { value } = e.target;

    setLanguage(value);
    i18n.changeLanguage(value);
    localStorage.setItem('i18nextLng', value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{t('Language')}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={localStorage.getItem('i18nextLng') || language}
        label={t('Language')}
        size="small"
        onChange={handleLanguageChange}
      >
        <MenuItem value="pl">PL</MenuItem>
        <MenuItem value="en">EN</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ChangeLanguage;
