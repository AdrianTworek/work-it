import { ReactElement, ReactNode } from 'react'

import { Paper, Stack, Typography } from '@mui/material'

type Props = {
  title: string
  icon?: ReactElement
  children?: ReactNode
}

const PaperWrapper = ({ title, icon, children }: Props) => {
  return (
    <Paper
      elevation={3}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, mt: 5 }}
    >
      <Stack spacing={3} alignItems="flex-start">
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="h5">{title}</Typography>
        </Stack>

        {children}
      </Stack>
    </Paper>
  )
}

export default PaperWrapper
