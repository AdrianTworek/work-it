import { createApi } from '@reduxjs/toolkit/query/react'
import customFetchBase from '../../../authentication/services/api/customFetchBase'
import {
  IApplication,
  IOffer,
  IOfferFilters,
  IOfferUpdate,
  IRecruitmentStep,
} from './types'

export const offerApi = createApi({
  reducerPath: 'offerApi',
  baseQuery: customFetchBase,
  tagTypes: ['Offers', 'Offer'],
  endpoints: (builder) => ({
    getAllOffers: builder.query<
      { offers: IOffer[]; offersCount: number; totalOffers: number },
      IOfferFilters | void
    >({
      query(queryFilters) {
        return {
          url: 'offers',
          params: { ...queryFilters },
        }
      },
      providesTags: ['Offers'],
      transformResponse(response: {
        data: IOffer[]
        offersCount: number
        totalOffers: number
      }) {
        return {
          offers: response.data,
          offersCount: response.offersCount,
          totalOffers: response.totalOffers,
        }
      },
    }),
    getAllEmployerOffers: builder.query<IOffer[], void>({
      query() {
        return {
          url: 'offers/employer/get',
          credentials: 'include',
        }
      },
      providesTags: ['Offers', 'Offer'],
    }),
    getAllCandidates: builder.query<IApplication[], void>({
      query() {
        return {
          url: 'offers/candidates/get',
          credentials: 'include',
        }
      },
      providesTags: ['Offers', 'Offer'],
    }),
    getOffer: builder.query<IOffer, string>({
      query(id) {
        return {
          url: `offers/${id}`,
        }
      },
      providesTags: ['Offers'],
    }),
    getOfferStats: builder.query<(IApplication & { score: number })[], string>({
      query(id) {
        return {
          url: `offers/${id}/stats`,
          credentials: 'include',
        }
      },
      providesTags: ['Offers'],
    }),
    createOffer: builder.mutation<IOffer, Partial<IOffer>>({
      query(body) {
        return {
          url: 'offers',
          method: 'POST',
          body,
          credentials: 'include',
        }
      },
      invalidatesTags: ['Offers'],
    }),
    createRecruitmentStep: builder.mutation<
      IRecruitmentStep,
      Partial<IRecruitmentStep>
    >({
      query({ offerId, ...data }) {
        return {
          url: `offers/${offerId}/recruitmentSteps`,
          method: 'POST',
          body: data,
          credentials: 'include',
        }
      },
      invalidatesTags: ['Offers', 'Offer'],
    }),
    updateOffer: builder.mutation<IOffer, IOfferUpdate>({
      query({ id, ...data }) {
        return {
          url: `offers/${id}`,
          method: 'PATCH',
          body: data,
          credentials: 'include',
        }
      },
      invalidatesTags: ['Offers', 'Offer'],
    }),
    deleteOffer: builder.mutation<IOffer, { offerId: string }>({
      query({ offerId }) {
        return {
          url: `offers/${offerId}`,
          method: 'DELETE',
          credentials: 'include',
        }
      },
      invalidatesTags: ['Offers', 'Offer'],
    }),
    deleteRecruitmentStep: builder.mutation<
      { message: string },
      { offerId: string; recruitmentStepId: string }
    >({
      query({ offerId, recruitmentStepId }) {
        return {
          url: `offers/${offerId}/recruitmentSteps/${recruitmentStepId}`,
          method: 'DELETE',
          credentials: 'include',
        }
      },
      invalidatesTags: ['Offers', 'Offer'],
    }),
  }),
})

export const {
  useGetAllOffersQuery,
  useGetAllEmployerOffersQuery,
  useGetAllCandidatesQuery,
  useGetOfferQuery,
  useGetOfferStatsQuery,
  useCreateOfferMutation,
  useCreateRecruitmentStepMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useDeleteRecruitmentStepMutation,
} = offerApi
