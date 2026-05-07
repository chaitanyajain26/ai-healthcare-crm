import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aiApi } from "../../services/aiApi";

const fallbackAnalysis = {
  summary: "HCP showed strong interest in onboarding support and practical patient education materials.",
  sentiment: "Positive",
  confidence: 0.84,
  entities: ["Dr. Aisha Menon", "GLP-1", "Adherence", "Dosing guide"],
  suggestedActions: ["Send branded dosing guide", "Schedule a follow-up in 7 days", "Invite HCP to virtual education session"]
};

export const analyzeInteraction = createAsyncThunk("aiAssistant/analyze", async (draftInteraction) => {
  try {
    return await aiApi.analyzeInteraction(draftInteraction);
  } catch {
    return fallbackAnalysis;
  }
});

export const sendAssistantMessage = createAsyncThunk(
  "aiAssistant/sendMessage",
  async ({ message, draftInteraction }, { getState }) => {
    const existingMessages = getState().aiAssistant.messages;
    try {
      return await aiApi.chat([...existingMessages, { role: "user", content: message }], draftInteraction);
    } catch {
      return {
        message:
          "I reviewed the draft notes. The strongest next step is to send patient onboarding material and schedule a focused follow-up around adherence barriers.",
        analysis: fallbackAnalysis
      };
    }
  }
);

const aiAssistantSlice = createSlice({
  name: "aiAssistant",
  initialState: {
    messages: [
      {
        role: "assistant",
        content: "Ready to help summarize notes, extract entities, score sentiment, and shape follow-up actions."
      }
    ],
    analysis: fallbackAnalysis,
    loading: false,
    error: null
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: "user", content: action.payload });
    },
    resetAssistant: (state) => {
      state.messages = state.messages.slice(0, 1);
      state.analysis = fallbackAnalysis;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeInteraction.pending, (state) => {
        state.loading = true;
      })
      .addCase(analyzeInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.analysis = action.payload;
      })
      .addCase(sendAssistantMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendAssistantMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: "assistant", content: action.payload.message });
        if (action.payload.analysis) {
          state.analysis = action.payload.analysis;
        }
      })
      .addCase(sendAssistantMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { addUserMessage, resetAssistant } = aiAssistantSlice.actions;
export default aiAssistantSlice.reducer;
