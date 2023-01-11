import { Dispatch, memo, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Slider, Stack, TextField, Typography } from '@mui/material'

const valuetext = (value: number) => `${value} PLN`

type Props = {
  salaryRange: number[]
  setSalaryRange: Dispatch<SetStateAction<number[]>>
}

const SalaryRange = memo(({ salaryRange, setSalaryRange }: Props) => {
  const { t } = useTranslation(['home'])

  const handleChange = (event: Event, newValue: number | number[]) => {
    setSalaryRange(newValue as number[])
  }

  return (
    <Stack>
      <Typography variant="h6" color="text.secondary">
        {salaryRange[0].toLocaleString()} - {salaryRange[1].toLocaleString()}{' '}
        PLN
      </Typography>

      <Stack direction="row" spacing={1} mt={2} mb={2}>
        <TextField
          id="outlined-number"
          label={t('From')}
          type="number"
          color="secondary"
          value={salaryRange[0]}
          onChange={(e) =>
            +e.target.value >= 0 &&
            +e.target.value <= 100000 &&
            setSalaryRange([+e.target.value, salaryRange[1]])
          }
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="outlined-number"
          label={t('To')}
          type="number"
          color="secondary"
          value={salaryRange[1]}
          onChange={(e) =>
            +e.target.value >= 0 &&
            +e.target.value <= 100000 &&
            setSalaryRange([salaryRange[0], +e.target.value])
          }
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Stack>

      <Box sx={{ maxWidth: 300 }}>
        <Slider
          color="secondary"
          getAriaLabel={() => 'Salary range'}
          value={salaryRange}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          min={0}
          max={100000}
          step={100}
        />
      </Box>
    </Stack>
  )
})

export default SalaryRange
