import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLiveContent } from "../Services/Contentservices";
// ===================================================
// INITIAL STATE
// ===================================================

const initialState = {
  items: [],

  activeContent: null,

  activeIndex: 0,

  teacherId: null,

  loading: false,

  error: null,

  isEmpty: false,
};

// ===================================================
// FETCH LIVE CONTENT
// ===================================================

export const fetchLiveContentThunk = createAsyncThunk(
  "live/fetchLiveContent",

  async (teacherId,thunkAPI) => {
    try {
      const response = await getLiveContent(teacherId);

      const data = response.data;

      if (!data || data.length === 0) return [];

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.message,
      });
    }
  },
);

// ===================================================
// SLICE
// ===================================================

const liveContentSlice = createSlice({
  name: "liveContent",

  initialState,

  reducers: {
    setTeacherId: (state, action) => {
      state.teacherId = action.payload;
    },

    clearLiveContent: (state) => {
      state.items = [];
      state.activeContent = null;
      state.activeIndex = 0;
      state.isEmpty = false;
    },

    showNextContent: (state) => {
      if (state.items.length === 0) return;

      state.activeIndex = (state.activeIndex + 1) % state.items.length;
      state.activeContent = state.items[state.activeIndex];
      state.isEmpty = false;
    },

    showPreviousContent: (state) => {
      if (state.items.length === 0) return;

      state.activeIndex =
        (state.activeIndex - 1 + state.items.length) % state.items.length;
      state.activeContent = state.items[state.activeIndex];
      state.isEmpty = false;
    },

    showContentAtIndex: (state, action) => {
      const index = action.payload;

      if (index < 0 || index >= state.items.length) return;

      state.activeIndex = index;
      state.activeContent = state.items[index];
      state.isEmpty = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===========================================
      // PENDING
      // ===========================================

      .addCase(fetchLiveContentThunk.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      // ===========================================
      // SUCCESS
      // ===========================================

      .addCase(fetchLiveContentThunk.fulfilled, (state, action) => {
        state.loading = false;

        const items = action.payload;

        state.items = items;

        if (items.length === 0) {
          state.activeContent = null;
          state.activeIndex = 0;
          state.isEmpty = true;
          return;
        }

        const currentId = state.activeContent?.id;
        const currentIndex = items.findIndex((item) => item.id === currentId);
        state.activeIndex = currentIndex >= 0 ? currentIndex : items.length - 1;
        state.activeContent = items[state.activeIndex];

        state.isEmpty = false;
      })

      // ===========================================
      // FAILED
      // ===========================================

      .addCase(fetchLiveContentThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.message;
      });
  },
});

export const {
  setTeacherId,
  clearLiveContent,
  showNextContent,
  showPreviousContent,
  showContentAtIndex,
} = liveContentSlice.actions;

export default liveContentSlice.reducer;
