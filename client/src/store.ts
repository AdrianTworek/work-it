import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import {
  authApi,
  userApi,
  offerApi,
  applicationApi,
  notificationApi,
  authReducer,
  themeReducer,
  favoriteOffersReducer,
  notificationsReducer,
} from './features'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    authState: authReducer,
    themeState: themeReducer,
    favoriteOffersState: favoriteOffersReducer,
    notificationsState: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      authApi.middleware,
      userApi.middleware,
      offerApi.middleware,
      applicationApi.middleware,
      notificationApi.middleware,
    ]),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
