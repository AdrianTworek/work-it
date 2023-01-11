import { Controller, useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  InputProps,
  OutlinedInput,
} from '@mui/material'

type IFormInputProps = {
  name: string
  label: string
} & InputProps

const FormInput = ({ name, label, ...otherProps }: IFormInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel htmlFor={name}>{label}</InputLabel>
          <Input {...field} id={name} error={!!errors[name]} {...otherProps} />
          <FormHelperText id={`${name}-helper-text`} error={!!errors[name]}>
            {errors[name] ? (errors[name]?.message as any) : ''}
          </FormHelperText>
        </FormControl>
      )}
    />
  )
}

export default FormInput
