import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../../store'
import { INotification } from '../api/types'

interface INotificationsState {
  notifications: INotification[]
}

const initialState: INotificationsState = {
  notifications: [],
}

export const notificationsSlice = createSlice({
  initialState,
  name: 'notificationsSlice',
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications = [...state.notifications, action.payload]
    },
  },
})

export default notificationsSlice.reducer

export const { setNotifications, addNotification } = notificationsSlice.actions

export const selectNotifications = createSelector(
  (state: RootState) => state.notificationsState.notifications,
  (item) => item
)
