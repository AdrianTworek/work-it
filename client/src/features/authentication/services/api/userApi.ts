import { createApi } from '@reduxjs/toolkit/query/react'
import { setUser } from '../slices/userSlice'
import customFetchBase from './customFetchBase'
import { IUser, IUserUpdate } from './types'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customFetchBase,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getMe: builder.query<IUser, null>({
      query() {
        return {
          url: 'users/me',
          credentials: 'include',
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data as IUser))
        } catch (error) {}
      },
    }),
    updateUser: builder.mutation<IUser, IUserUpdate>({
      query: ({ id, ...data }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data as IUser))
        } catch (error) {}
      },
    }),
    deleteUser: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useUpdateUserMutation, useDeleteUserMutation } = userApi
