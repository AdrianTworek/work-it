import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { IApplication } from '../../services/api/types'

import { Avatar, Stack, Typography } from '@mui/material'

type Props = {
  data: IApplication & { score: number }
  position: number
}

const RankingRow = ({ data, position }: Props) => {
  const navigate = useNavigate()

  const totalPoints = useMemo(() => {
    let totalPoints = 0
    data?.ratings?.forEach((el) => {
      totalPoints += el.recruitmentStep.importanceLevel * 5
    })

    return totalPoints
  }, [data])

  return (
    <Stack direction="row" alignItems="center">
      <Stack sx={{ mr: 5 }}>
        <Typography
          variant="h6"
          sx={{
            color:
              position === 1
                ? 'gold'
                : position === 2
                ? 'silver'
                : position === 3
                ? '#b9936c'
                : 'white',
          }}
        >
          {position}.
        </Typography>
      </Stack>
      <Stack
        sx={{ mr: 5, alignItems: 'center' }}
        direction="row"
        spacing={1}
        onClick={() =>
          navigate(`/employer/dashboard/offers/${data.offerId}/apps/${data.id}`)
        }
      >
        <Avatar
          src={data.candidate?.photo || ''}
          alt={data.candidate.name + 'photo'}
        />
        <Typography variant="h6" color="text.secondary">
          {data.candidate.name}
        </Typography>
      </Stack>
      <Stack sx={{ ml: 'auto' }}>
        <Typography variant="body1">
          {data.score}/{totalPoints}
        </Typography>
      </Stack>
    </Stack>
  )
}

export default RankingRow
