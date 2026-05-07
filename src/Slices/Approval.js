// src/Slices/approvalSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  approveContent,
  rejectContent,
  logApproval,
} from "../Services/approvalservices";

import { toast } from "react-toastify";

// ─────────────────────────────────────────────
// APPROVE CONTENT
// ─────────────────────────────────────────────

export const approveContentThunk = createAsyncThunk(
  "approval/approveContent",

  async ({ contentId, principalId }, thunkAPI) => {
    try {
      // Update content
      console.log("contentid",contentId);
      console.log("principal",principalId);

      const res = await approveContent(contentId, principalId);

      // Add approval log

      await logApproval(contentId, principalId, "approved");

      toast.success("Content approved");

      return { id: contentId };
    } catch (error) {
      toast.error("Approval failed");
      return thunkAPI.rejectWithValue({
        message: error.message,
      });
    }
  },
);

// ─────────────────────────────────────────────
// REJECT CONTENT
// ─────────────────────────────────────────────

export const rejectContentThunk = createAsyncThunk(
  "approval/rejectContent",

  async ({ contentId, principalId, reason }, thunkAPI) => {
    try {
      // Update content
      console.log("contentid", contentId);
      console.log("principal", principalId);
      console.log("reason", reason);

      const res = await rejectContent(contentId, reason);

      // Add rejection log

      await logApproval(contentId, principalId, "rejected", reason);
      toast.success("Content rejected");
      return { id: contentId }; // ✅ explicitly return id for filtering
    } catch (error) {
      toast.error("Rejection failed");
      return thunkAPI.rejectWithValue({
        message: error.message,
      });
    }
  },
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────

const approvalSlice = createSlice({
  name: "approval",

  initialState: {
    loading: false,

    error: null,

    successMessage: null,

    pendingContent: [],
  },

  reducers: {
    clearApprovalState(state) {
      state.loading = false;

      state.error = null;

      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ─────────────────────────
      // APPROVE
      // ─────────────────────────

      .addCase(
        approveContentThunk.pending,

        (state) => {
          state.loading = true;

          state.error = null;
        },
      )

      .addCase(approveContentThunk.fulfilled, (state, action) => {
        console.log("removing approved:", action.payload.id);
        state.loading = false;
        state.successMessage = "Content approved";
        state.pendingContent = state.pendingContent.filter(
          (item) => item.id !== action.payload.id, // ✅ now payload.id is always set
        );
      })

      .addCase(
        approveContentThunk.rejected,

        (state, action) => {
          state.loading = false;

          state.error = action.payload.message;
        },
      )

      // ─────────────────────────
      // REJECT
      // ─────────────────────────

      .addCase(
        rejectContentThunk.pending,

        (state) => {
          state.loading = true;

          state.error = null;
        },
      )

      .addCase(rejectContentThunk.fulfilled, (state, action) => {
        console.log("removing rejected:", action.payload.id); // debug
        state.loading = false;
        state.successMessage = "Content rejected";
        state.pendingContent = state.pendingContent.filter(
          (item) => item.id !== action.payload.id, // ✅ now payload.id is always set
        );
      })

      .addCase(
        rejectContentThunk.rejected,

        (state, action) => {
          state.loading = false;

          state.error = action.payload.message;
        },
      );
  },
});

export const { clearApprovalState } = approvalSlice.actions;

export default approvalSlice.reducer;

// ─────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────

export const selectApprovalLoading = (state) => state.approval.loading;

export const selectApprovalError = (state) => state.approval.error;

export const selectApprovalSuccess = (state) => state.approval.successMessage;
