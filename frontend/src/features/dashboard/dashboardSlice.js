import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    aiInsights: [
      "Cardiology accounts are asking for more real-world evidence before onboarding new patients.",
      "Adherence education is the most common follow-up theme across high-value HCPs.",
      "Three accounts have upcoming formulary conversations where MSL support may improve close rate."
    ],
    loading: false,
    error: null
  },
  reducers: {
    setInsights: (state, action) => {
      state.aiInsights = action.payload;
    }
  }
});

export const { setInsights } = dashboardSlice.actions;
export default dashboardSlice.reducer;
