import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAppSelector } from './store'
import { selectTheme } from './features/theme/themeSlice'
import { selectUser } from './features/authentication/services/slices/userSlice'
import { RoleEnum } from './features/authentication/helpers/RequireUser'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { darkTheme, lightTheme } from './theme'

import { RequireUser } from './features'
import {
  Admin,
  Home,
  Dashboard,
  Login,
  Register,
  Unauthorized,
  NotFoundPage,
  Favorites,
  OfferDetails,
} from './pages'
import { Layout } from './components'

const App = () => {
  const mode = useAppSelector(selectTheme)
  const user = useAppSelector(selectUser)

  return (
    <Suspense fallback={null}>
      <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="offers/:offerId" element={<OfferDetails />} />

            {/* Protected routes */}
            <Route
              element={
                <RequireUser
                  restrictTo={[RoleEnum.CANDIDATE, RoleEnum.EMPLOYER]}
                />
              }
            >
              <Route
                path="/dashboard"
                element={
                  user?.role === RoleEnum.CANDIDATE ? (
                    <Navigate to="/candidate/dashboard/profile" />
                  ) : user?.role === RoleEnum.EMPLOYER ? (
                    <Navigate to="/employer/dashboard/profile" />
                  ) : null
                }
              />
            </Route>
            <Route element={<RequireUser restrictTo={[RoleEnum.CANDIDATE]} />}>
              <Route path="candidate/dashboard/*" element={<Dashboard />} />
            </Route>
            <Route element={<RequireUser restrictTo={[RoleEnum.EMPLOYER]} />}>
              <Route path="employer/dashboard/*" element={<Dashboard />} />
            </Route>
            <Route element={<RequireUser restrictTo={[RoleEnum.ADMIN]} />}>
              <Route path="admin" element={<Admin />} />
            </Route>
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </Suspense>
  )
}

export default App
