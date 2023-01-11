import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from '../../../authentication/services/api/customFetchBase'
import { setNotifications } from '../slices/notificationsSlice'
import {
  INotification,
  INotificationCreate,
  INotificationUpdate,
} from './types'

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: customFetchBase,
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getAllUserNotifications: builder.query<INotification[], void>({
      query() {
        return {
          url: 'notifications',
          credentials: 'include',
        }
      },
      providesTags: ['Notifications'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setNotifications(data as INotification[]))
        } catch (error) {}
      },
    }),
    createNotification: builder.mutation<INotification, INotificationCreate>({
      query(body) {
        return {
          url: 'notifications',
          method: 'POST',
          body,
          credentials: 'include',
        }
      },
      invalidatesTags: ['Notifications'],
    }),
    updateNotification: builder.mutation<
      INotification,
      { id: string; body: INotificationUpdate }
    >({
      query({ id, body }) {
        return {
          url: `notifications/${id}`,
          method: 'PATCH',
          body,
          credentials: 'include',
        }
      },
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: builder.mutation<any, { id: string }>({
      query({ id }) {
        return {
          url: `notifications/${id}`,
          method: 'DELETE',
          credentials: 'include',
        }
      },
      invalidatesTags: ['Notifications'],
    }),
  }),
})

export const {
  useGetAllUserNotificationsQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi
