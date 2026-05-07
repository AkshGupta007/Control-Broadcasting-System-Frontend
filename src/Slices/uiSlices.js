import { createSlice } from "@reduxjs/toolkit";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  theme:
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"),


  modal: {
    isOpen: false,

    type: null, // rejectModal | previewModal

    data: null,
  },

  // ==========================================
  // SIDEBAR
  // ==========================================

  sidebarOpen: true,
};

// =====================================================
// SLICE
// =====================================================

const uiSlice = createSlice({
  name: "ui",

  initialState,

  reducers: {
    // =================================================
    // TOAST
    // =================================================

    // showToast: (state, action) => {
    //   state.toast.show = true;

    //   state.toast.message = action.payload.message;

    //   state.toast.type = action.payload.type;
    // },

    // hideToast: (state) => {
    //   state.toast.show = false;

    //   state.toast.message = "";

    //   state.toast.type = "success";
    // },

    // =================================================
    // MODAL
    // =================================================

    openModal: (state, action) => {
      state.modal.isOpen = true;

      state.modal.type = action.payload.type;

      state.modal.data = action.payload.data;
    },

    closeModal: (state) => {
      state.modal.isOpen = false;

      state.modal.type = null;

      state.modal.data = null;
    },

    // =================================================
    // SIDEBAR
    // =================================================

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
  },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  // Toast
  showToast,
  hideToast,

  // Modal
  openModal,
  closeModal,

  // Sidebar
  toggleSidebar,

  // Theme
  setTheme,
  toggleTheme,
} = uiSlice.actions;

// =====================================================
// EXPORT REDUCER
// =====================================================

export default uiSlice.reducer;
