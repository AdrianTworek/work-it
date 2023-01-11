import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../../store'
import { IUser } from '../api/types'

interface IUserState {
  user: IUser | null
}

const initialState: IUserState = {
  user: null,
}

export const authSlice = createSlice({
  initialState,
  name: 'authSlice',
  reducers: {
    logout: () => initialState,
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    },
  },
})

export default authSlice.reducer

export const { logout, setUser } = authSlice.actions

export const selectUser = createSelector(
  (state: RootState) => state.authState.user,
  (item) => item
)
