import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import interactionReducer from "../features/interactions/interactionSlice";
import aiAssistantReducer from "../features/aiAssistant/aiAssistantSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interactions: interactionReducer,
    aiAssistant: aiAssistantReducer,
    dashboard: dashboardReducer
  }
});
