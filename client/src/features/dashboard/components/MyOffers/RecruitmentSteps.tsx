import { FormEvent, useState } from 'react'
import { IOffer } from '../../services/api/types'
import {
  useCreateRecruitmentStepMutation,
  useDeleteRecruitmentStepMutation,
} from '../../services/api/offerApi'

import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Delete } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

type Props = {
  offer: IOffer
}

const INITIAL_IMPORTANCE_LEVEL = 3

const RecruitmentSteps = ({ offer }: Props) => {
  const { t } = useTranslation(['dashboard'])
  const [name, setName] = useState('')
  const [importanceLevel, setImportanceLevel] = useState(
    INITIAL_IMPORTANCE_LEVEL
  )

  const [createRecruitmentStep] = useCreateRecruitmentStepMutation()
  const [deleteRecruitmentStep] = useDeleteRecruitmentStepMutation()

  const handleAddRecruitmentStep = (e: FormEvent) => {
    e.preventDefault()

    createRecruitmentStep({ offerId: offer.id, name, importanceLevel })

    setName('')
    setImportanceLevel(INITIAL_IMPORTANCE_LEVEL)
  }

  const handleDeleteRecruitmentStep = (recruitmentStepId: string) => {
    deleteRecruitmentStep({ offerId: offer.id, recruitmentStepId })
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">
        {t('RecruitmentSteps')} ({offer?.recruitmentSteps?.length})
      </Typography>

      <Stack
        component="form"
        direction="row"
        spacing={1}
        onSubmit={handleAddRecruitmentStep}
      >
        <TextField
          placeholder={t('StepName')!}
          size="small"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FormControl sx={{ width: 120 }}>
          <InputLabel id="select-importance-level">
            {t('ImportanceLevel')}
          </InputLabel>
          <Select
            labelId="select-importance-level"
            id="select-importance-level"
            value={importanceLevel}
            label={t('ImportanceLevel')}
            size="small"
            onChange={(e) => setImportanceLevel(+e.target.value)}
            required
          >
            {[1, 2, 3, 4, 5].map((el) => (
              <MenuItem key={el} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton component="button" type="submit" color="primary">
          <AddCircleIcon />
        </IconButton>
      </Stack>

      {offer?.recruitmentSteps?.map((step) => (
        <Stack
          key={step.id}
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexWrap: 'wrap' }}
        >
          <Typography variant="body1" color="text.secondary" noWrap>
            {step.name} - {step.importanceLevel}
          </Typography>

          <IconButton
            color="error"
            onClick={() => handleDeleteRecruitmentStep(step.id)}
          >
            <Delete sx={{ width: 16, height: 16 }} />
          </IconButton>
        </Stack>
      ))}
    </Stack>
  )
}

export default RecruitmentSteps
