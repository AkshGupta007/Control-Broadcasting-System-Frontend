import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import {
  getAllContent,
  getMyContent,
  uploadContent,
} from "../Services/Contentservices";

// ─────────────────────────────────────────────
// THUNKS
// ─────────────────────────────────────────────

// Teacher Content

export const fetchMyContentThunk = createAsyncThunk(
  "content/fetchMine",

  async (teacherId, thunkAPI) => {
    try {
      console.log("teacher id in content slice", teacherId);

      const res = await getMyContent(teacherId);

      return res.data;
    } catch (error) {
      toast.error("Could not load your content");
      return thunkAPI.rejectWithValue({
        message: error.message,
      });
    }
  },
);

// Principal Content

export const fetchAllContentThunk = createAsyncThunk(
  "content/fetchAll",

  async (_, thunkAPI) => {
    try {
      const res = await getAllContent();

      return res.data;
    } catch (error) {
      toast.error("Could not load all content");
      return thunkAPI.rejectWithValue({
        message: error.message,
      });
    }
  },
);

// Pending Content For Principal Approval

export const fetchPendingContentThunk = createAsyncThunk(
  "content/fetchPending",

  async (_, thunkAPI) => {
    try {
      const res = await getAllContent();

      const pending = res.data.filter((item) => item.status === "pending");

      return pending;
    } catch (error) {
      toast.error("Could not load pending content");
      return thunkAPI.rejectWithValue({
        message: error.message,
      });
    }
  },
);

// Upload Content

export const uploadContentThunk = createAsyncThunk(
  "content/upload",
  async (data, thunkAPI) => {
    try {
      const res = await uploadContent({
        ...data,
        teacherId: String(data.teacherId),
      });

      // ✅ After upload, refetch all teacher content so list is fresh
      thunkAPI.dispatch(fetchMyContentThunk(String(data.teacherId)));

      toast.success("Content submitted for approval");

      return res.data;
    } catch (error) {
      toast.error("Content upload failed");
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────

const contentSlice = createSlice({
  name: "content",

  initialState: {
    // Principal All Content
    items: [],

    // Teacher Content
    myContent: [],

    // Principal Pending Approvals
    pendingContent: [],

    filters: {
      status: "all",
      search: "",
    },

    loading: false,

    error: null,

    uploadStatus: "idle",
  },

  reducers: {
    setFilter(state, action) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetUploadStatus(state) {
      state.uploadStatus = "idle";
    },
  },

  extraReducers: (builder) => {
    builder

      // ─────────────────────────────
      // FETCH MY CONTENT
      // ─────────────────────────────

      .addCase(
        fetchMyContentThunk.pending,

        (state) => {
          state.loading = true;

          state.error = null;
        },
      )

      .addCase(
        fetchMyContentThunk.fulfilled,

        (state, action) => {
          state.loading = false;

          state.myContent = action.payload;
        },
      )

      .addCase(
        fetchMyContentThunk.rejected,

        (state, action) => {
          state.loading = false;

          state.error = action.payload.message;
        },
      )

      // ─────────────────────────────
      // FETCH ALL CONTENT
      // ─────────────────────────────

      .addCase(
        fetchAllContentThunk.pending,

        (state) => {
          state.loading = true;
        },
      )

      .addCase(
        fetchAllContentThunk.fulfilled,

        (state, action) => {
          state.loading = false;

          state.items = action.payload;
        },
      )

      .addCase(
        fetchAllContentThunk.rejected,

        (state, action) => {
          state.loading = false;

          state.error = action.payload.message;
        },
      )

      // ─────────────────────────────
      // FETCH PENDING CONTENT
      // ─────────────────────────────

      .addCase(
        fetchPendingContentThunk.pending,

        (state) => {
          state.loading = true;
        },
      )

      .addCase(
        fetchPendingContentThunk.fulfilled,

        (state, action) => {
          state.loading = false;

          state.pendingContent = action.payload;
        },
      )

      .addCase(
        fetchPendingContentThunk.rejected,

        (state, action) => {
          state.loading = false;

          state.error = action.payload.message;
        },
      )

      // ─────────────────────────────
      // UPLOAD CONTENT
      // ─────────────────────────────

      .addCase(
        uploadContentThunk.pending,

        (state) => {
          state.uploadStatus = "uploading";
        },
      )

      .addCase(
        uploadContentThunk.fulfilled,

        (state, action) => {
          state.uploadStatus = "success";

          // Teacher list update
          state.myContent.push(action.payload);

          // Principal pending list update
          state.pendingContent.push(action.payload);

          // Principal all content update
          state.items.push(action.payload);
        },
      )

      .addCase(
        uploadContentThunk.rejected,

        (state, action) => {
          state.uploadStatus = "failed";

          state.error = action.payload.message;
        },
      );
  },
});

export const { setFilter, resetUploadStatus } = contentSlice.actions;

export default contentSlice.reducer;

// ─────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────

export const selectMyContent = (state) => state.content.myContent;

export const selectAllContent = (state) => state.content.items;

export const selectPendingContent = (state) => state.content.pendingContent;

export const selectUploadStatus = (state) => state.content.uploadStatus;

export const selectFilters = (state) => state.content.filters;

export const selectContentLoading = (state) => state.content.loading;
