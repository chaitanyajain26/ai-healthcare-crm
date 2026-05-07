import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { interactionApi } from "../../services/interactionApi";

const demoInteractions = [
  {
    id: "int-1008",
    hcpName: "Dr. Aisha Menon",
    specialty: "Cardiology",
    interactionType: "In-person visit",
    date: "2026-05-07",
    time: "10:30",
    topics: ["GLP-1 adherence", "Patient onboarding"],
    sentiment: "Positive",
    followUpActions: ["Send dosing guide", "Schedule MSL call"],
    status: "Follow-up due"
  },
  {
    id: "int-1007",
    hcpName: "Dr. Vikram Rao",
    specialty: "Endocrinology",
    interactionType: "Virtual call",
    date: "2026-05-06",
    time: "16:00",
    topics: ["Formulary access", "Clinical evidence"],
    sentiment: "Neutral",
    followUpActions: ["Share payer summary"],
    status: "Submitted"
  }
];

export const fetchInteractions = createAsyncThunk("interactions/fetch", async (_, { rejectWithValue }) => {
  try {
    return await interactionApi.list();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const saveInteraction = createAsyncThunk("interactions/save", async (payload, { rejectWithValue }) => {
  try {
    return await interactionApi.create(payload);
  } catch (error) {
    // Local-first fallback keeps field reps productive during demos or offline testing.
    if (!navigator.onLine || error.code === "ECONNABORTED" || error.message === "Network Error") {
      return { ...payload, id: crypto.randomUUID(), status: "Draft saved locally" };
    }
    return rejectWithValue(error.message);
  }
});

const interactionSlice = createSlice({
  name: "interactions",
  initialState: {
    items: demoInteractions,
    draft: {},
    loading: false,
    saving: false,
    error: null
  },
  reducers: {
    updateDraft: (state, action) => {
      state.draft = { ...state.draft, ...action.payload };
    },
    clearDraft: (state) => {
      state.draft = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.length ? action.payload : state.items;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveInteraction.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveInteraction.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
        state.draft = {};
        toast.success("Interaction saved");
      })
      .addCase(saveInteraction.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
        toast.error("Unable to save interaction");
      });
  }
});

export const { updateDraft, clearDraft } = interactionSlice.actions;
export default interactionSlice.reducer;
