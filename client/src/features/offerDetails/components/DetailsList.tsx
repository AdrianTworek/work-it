import { Stack, Typography } from '@mui/material'
import { ReactElement } from 'react'

type Props = {
  title: string
  data: string[] | undefined
  icon?: ReactElement
}

const DetailsList = ({ title, data, icon }: Props) => {
  return (
    <Stack spacing={1}>
      <Typography
        variant="h6"
        fontWeight={600}
        color="text.secondary"
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        {icon} {title}
      </Typography>
      <ul>
        {data?.map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Stack>
  )
}

export default DetailsList
