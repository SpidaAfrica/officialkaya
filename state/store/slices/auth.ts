"use client";
export const dynamic = "force-dynamic";
// const authSlice = createSlice({
//   name: "auth",
//   initialState: {},
//   reducers: {},
// });

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type AuthState = {
  user: unknown | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  error?: string | null;
};

const initialState: AuthState & {
  // redirect here is used to move a user to a different page used to handle navigation outside a component body. It's used alongside the redirect util component found in @/utils/redirect
  redirect: { url: string; action: keyof AppRouterInstance } | null; // page url to redirect to
} = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  redirect: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", state.token || "");
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      console.log("CLEARED_USER");
    },
    redirectUser(
      state,
      action: PayloadAction<(typeof initialState)["redirect"]>
    ) {
      state.redirect = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder;
  //   // Handle signupUser and other async thunks similarly...
  // },
});

export const { setUser, clearUser, redirectUser } = authSlice.actions;
export default authSlice;
