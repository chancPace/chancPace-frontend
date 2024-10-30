import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  email: string | null;
  name: string | null;
  role: string | null;
  isLoggedIn: boolean;
}
const initialState: UserState = {
  email: null,
  name: null,
  role: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.isLoggedIn = action.payload.isLoggedIn; // isLoggedIn 값을 추가합니다.
    },
    clearUser: (state) => {
      state.email = null;
      state.name = null;
      state.role = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
