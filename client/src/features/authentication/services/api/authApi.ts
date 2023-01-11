import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from './customFetchBase'
import { userApi } from './userApi'
import { IUser } from './types'

import { LoginInput } from '../../components/LoginForm'
import { RegisterInput } from '../../components/RegisterForm'
import { ChangePasswordInput } from '../../../dashboard/components/Settings/Settings'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    registerUser: builder.mutation<IUser, RegisterInput>({
      query(body) {
        return {
          url: 'auth/register',
          method: 'POST',
          body,
        }
      },
    }),
    loginUser: builder.mutation<{ accessToken: string }, LoginInput>({
      query(body) {
        return {
          url: 'auth/login',
          method: 'POST',
          body,
          credentials: 'include',
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          await dispatch(userApi.endpoints.getMe.initiate(null))
        } catch (error) {}
      },
    }),
    changePassword: builder.mutation<any, ChangePasswordInput>({
      query(body) {
        return {
          url: 'auth/changePassword',
          method: 'POST',
          body,
          credentials: 'include',
        }
      },
    }),
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: 'auth/logout',
          method: 'POST',
          credentials: 'include',
        }
      },
    }),
  }),
})

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useChangePasswordMutation,
  useLogoutUserMutation,
} = authApi
