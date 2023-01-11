import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IOffer } from '../../../dashboard/services/api/types'
import { RootState } from '../../../../store'

interface IFavoriteOffers {
  favorites: IOffer[]
}

const initialState: IFavoriteOffers = {
  favorites: JSON.parse(localStorage.getItem('favoriteOffers')!) || [],
}

export const favoriteOffersSlice = createSlice({
  initialState,
  name: 'favoriteOffersSlice',
  reducers: {
    addToFavorites: (state, { payload }: PayloadAction<IOffer>) => {
      const newState = [...state.favorites, payload]
      localStorage.setItem('favoriteOffers', JSON.stringify(newState))
      state.favorites = newState
    },
    deleteFromFavorites: (state, { payload }: PayloadAction<IOffer>) => {
      const newState = state.favorites.filter((el) => el.id !== payload.id)
      localStorage.setItem('favoriteOffers', JSON.stringify(newState))
      state.favorites = newState
    },
  },
})

export default favoriteOffersSlice.reducer

export const { addToFavorites, deleteFromFavorites } =
  favoriteOffersSlice.actions

export const selectFavoriteOffers = createSelector(
  (state: RootState) => state.favoriteOffersState.favorites,
  (item) => {
    return item
  }
)
