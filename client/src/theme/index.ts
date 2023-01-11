import { createTheme, ThemeOptions } from '@mui/material'

export const darkTheme: ThemeOptions = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#16a34a',
      contrastText: '#fff',
    },
    secondary: {
      main: '#d97706',
      contrastText: '#fff',
    },
    background: {
      default: '#1C1B1B',
      paper: '#181818',
    },
    text: {
      secondary: '#9ca3af',
    },
  },
})

export const lightTheme: ThemeOptions = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#16a34a',
      contrastText: '#fff',
    },
    secondary: {
      main: '#d97706',
      contrastText: '#fff',
    },
    background: {
      default: '#f3f6f8',
      paper: '#fafafa',
    },
    text: {},
  },
})
