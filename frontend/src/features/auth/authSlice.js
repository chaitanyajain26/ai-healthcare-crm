import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("helixcrm_user") || "null");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    isAuthenticated: Boolean(savedUser),
    loading: false,
    error: null
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("helixcrm_user", JSON.stringify(action.payload));
      localStorage.setItem("helixcrm_token", "demo-field-rep-token");
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("helixcrm_user");
      localStorage.removeItem("helixcrm_token");
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
