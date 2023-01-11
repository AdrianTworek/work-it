import { Box, CircularProgress } from '@mui/material'

const FullScreenLoader = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <CircularProgress size={100} />
    </Box>
  )
}

export default FullScreenLoader
