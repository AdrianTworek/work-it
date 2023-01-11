import { ReactNode } from 'react'
import { useAppSelector } from '../store'
import { selectTheme } from '../features/theme/themeSlice'

import { Box } from '@mui/material'

const DashboardContentLayout = ({ children }: { children: ReactNode }) => {
  const theme = useAppSelector(selectTheme)

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : '#fefefe',
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          width: '100%',
          margin: '0 auto',
          p: '60px 20px 100px 20px',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default DashboardContentLayout
