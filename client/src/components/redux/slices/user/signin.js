import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendAPI = "https://ekart-57l0.onrender.com";

export const postSignIn = createAsyncThunk(
  "postSignIn",
  async (values, { rejectWithValue }) => {
    let data = {
      email: values.email,
      password: values.password,
    };
    try {
      const res = await axios.post(`${backendAPI}/signin`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Store user information in localStorage
      localStorage.setItem("userInfo", JSON.stringify(res.data));

      return res.data; // Include the userRole in the payload
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);



const signInSlice = createSlice({
  initialState: {
    isLoading: false,
    user: null,
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || null, // Load user info from localStorage
    token: "",
    isError: false,
    error: "",
    selectSuccess: "",
  },
  name: "signin",
  reducers: {
    resetSignIn: (state) => {
      state.user = null;
      state.userInfo = null;
      localStorage.removeItem("userInfo"); // Remove user info from localStorage
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postSignIn.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(postSignIn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userRole = action.payload.userRole;
      
      state.userInfo = action.payload;
      if (
        action.payload &&
        action.payload.message &&
        Array.isArray(action.payload.message) &&
        action.payload.message.length > 0
      ) {
        state.selectSuccess = action.payload.message[0];
      } else {
        state.selectSuccess = "";
      }
      console.log("API Response:", action.payload);
    });

    builder.addCase(postSignIn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      if (
        action.payload &&
        action.payload.message &&
        action.payload.message.length > 0
      ) {
        state.error = action.payload.message[0];
      } else {
        state.error = "";
      }
    });

   
  },
});

export default signInSlice.reducer;
export const selectUserInfo = (state) => state.userSignIn.userInfo;
export const { resetSignIn } = signInSlice.actions;
