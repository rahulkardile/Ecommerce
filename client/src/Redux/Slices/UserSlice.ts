import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/types";

export type initialStates = {
  user: User | null;
  loading: boolean;
};

const initialState: initialStates = {
  user: null,
  loading: true,
};

export const UserSlice = createSlice({
  name: "UserSlices",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload,
      state.loading = false;
    },
    noUser: (state) => {
      (state.loading = false), (state.user = null);
    },
  },
});

export const { addUser, noUser } = UserSlice.actions;
