import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

interface IThemeSlice {
  mode: 'dark' | 'light'
}

const initialState: IThemeSlice = {
  mode: (localStorage.getItem('theme') || 'dark') as IThemeSlice['mode'],
}

export const themeSlice = createSlice({
  initialState,
  name: 'themeSlice',
  reducers: {
    setTheme: (state, action: PayloadAction<IThemeSlice['mode']>) => {
      localStorage.setItem('theme', action.payload)
      state.mode = action.payload
    },
  },
})

export default themeSlice.reducer

export const { setTheme } = themeSlice.actions

export const selectTheme = createSelector(
  (state: RootState) => state.themeState.mode,
  (item) => {
    return item
  }
)
