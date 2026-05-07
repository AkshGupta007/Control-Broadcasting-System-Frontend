import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../Services/Authservies";
import { toast } from "react-toastify";

// Load from localStorage at startup
let parsedToken = null;
try {
  const storedToken = localStorage.getItem("token");
  if (storedToken && storedToken !== "undefined") {
    parsedToken = storedToken;
  }
} catch (error) {
  console.error("Invalid token in localStorage:", error);
  parsedToken = null;
}

let parseduser= null;
try {
  const storeduser = localStorage.getItem("user");
  if (storeduser && storeduser !== "undefined") {
    parseduser = JSON.parse(storeduser);
  }
} catch (error) {
  console.error("Invalid user in localStorage:", error);
  parseduser = null;
}




const initialState = {
  user: parseduser,
  token: parsedToken,
  isAuthenticated: !!parsedToken,
  loading: false,
  error: null,
};


// ✅ Correct signature: (args, thunkAPI) — only 2 params
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await login(email, password); // ✅ call the service

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Logged in successfully");

      return data; // { user, token }
    } catch (error) {
      toast.error(error.message || "Login failed");
      return thunkAPI.rejectWithValue({
        message: error.message,
      });
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.info("Logged out successfully");
  
    },
    setUserFromToken(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout, setUserFromToken } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectRole = (state) => state.auth.user?.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
