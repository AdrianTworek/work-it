import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from '../../../authentication/services/api/customFetchBase'
import { IApplication, IApplicationUpdate, IRating } from './types'

export const applicationApi = createApi({
  reducerPath: 'applicationApi',
  baseQuery: customFetchBase,
  tagTypes: ['Applications', 'Application'],
  endpoints: (builder) => ({
    getAllCandidateApplications: builder.query<IApplication[], void>({
      query() {
        return {
          url: 'applications',
          credentials: 'include',
        }
      },
      providesTags: ['Applications'],
    }),
    getApplication: builder.query<IApplication, { id: string }>({
      query({ id }) {
        return {
          url: `applications/${id}`,
          credentials: 'include',
        }
      },
      providesTags: ['Application'],
    }),
    createApplication: builder.mutation<IApplication, { offerId: string }>({
      query(body) {
        return {
          url: 'applications',
          method: 'POST',
          body,
          credentials: 'include',
        }
      },
      invalidatesTags: ['Applications'],
    }),
    createRating: builder.mutation<
      IRating,
      {
        offerId: string
        applicationId: string
        recruitmentStepId: string
        ratingId: string
        grade: number | null
      }
    >({
      query({ offerId, applicationId, recruitmentStepId, ...data }) {
        return {
          url: `offers/${offerId}/recruitmentSteps/${recruitmentStepId}/applications/${applicationId}/ratings`,
          method: 'POST',
          body: data,
          credentials: 'include',
        }
      },
      invalidatesTags: ['Applications', 'Application'],
    }),
    deleteApplication: builder.mutation<
      { message: string },
      { applicationId: string }
    >({
      query({ applicationId }) {
        return {
          url: `applications/${applicationId}`,
          method: 'DELETE',
          credentials: 'include',
        }
      },
      invalidatesTags: ['Applications', 'Application'],
    }),
    updateApplication: builder.mutation<
      { message: string },
      IApplicationUpdate
    >({
      query({ id, ...data }) {
        return {
          url: `applications/${id}`,
          method: 'PATCH',
          body: data,
          credentials: 'include',
        }
      },
      invalidatesTags: ['Applications', 'Application'],
    }),
  }),
})

export const {
  useGetAllCandidateApplicationsQuery,
  useGetApplicationQuery,
  useCreateApplicationMutation,
  useCreateRatingMutation,
  useDeleteApplicationMutation,
  useUpdateApplicationMutation,
} = applicationApi
