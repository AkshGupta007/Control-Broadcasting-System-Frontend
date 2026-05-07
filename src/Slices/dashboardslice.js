import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyContent, getAllContent } from "../Services/Contentservices";
import { toast } from "react-toastify";

export const fetchTeacherDashboardStats = createAsyncThunk(
  "dashboard/fetchTeacherStats",

  async (teacherId, thunkAPI) => {
    try {
      const res = await getMyContent(teacherId);
      console.log("res is",res);

      const items = Array.isArray(res.data) ? res.data : [];

      return {
        total: items.length,

        pending: items.filter((c) => c.status === "pending").length,

        approved: items.filter((c) => c.status === "approved").length,

        rejected: items.filter((c) => c.status === "rejected").length,

        recent: items.slice(-5).reverse(),
      };
    } catch (error) {
      toast.error("Could not load teacher dashboard");
      return thunkAPI.rejectWithValue({
        message: error.message,
      });
    }
  },
);

export const fetchPrincipalDashboardStats = createAsyncThunk(
  "dashboard/fetchPrincipalStats",
  async (_, thunkAPI) => {
    try {
      const res = await getAllContent(); // GET /content (all teachers)
      const items = Array.isArray(res.data) ? res.data : [];
      console.log("principal items", items);

      return {
        total: items.length,
        pending: items.filter((c) => c.status === "pending").length,
        approved: items.filter((c) => c.status === "approved").length,
        rejected: items.filter((c) => c.status === "rejected").length,
        recent: items
          .filter((c) => c.status === "pending") // show pending first
          .slice(-5)
          .reverse(),
      };
    } catch (error) {
      toast.error("Could not load principal dashboard");
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  },
);


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: { total: 0, pending: 0, approved: 0, rejected: 0 },
    recent: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //////////teacher
      .addCase(fetchTeacherDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          total: action.payload.total,
          pending: action.payload.pending,
          approved: action.payload.approved,
          rejected: action.payload.rejected,
        };
        state.recent = action.payload.recent;
      })
      .addCase(fetchTeacherDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // ── Principal ────────────────────────────────────
      .addCase(fetchPrincipalDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrincipalDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          total: action.payload.total,
          pending: action.payload.pending,
          approved: action.payload.approved,
          rejected: action.payload.rejected,
        };
        state.recent = action.payload.recent;
      })
      .addCase(fetchPrincipalDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default dashboardSlice.reducer;

// Selectors
export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectRecentContent = (state) => state.dashboard.recent;
export const selectDashboardLoading = (state) => state.dashboard.loading;
