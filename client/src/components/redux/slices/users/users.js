import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendAPI = 'https://ekart-57l0.onrender.com';

const initialState = {
  users: [],
  loading: false,
  error: null,
  isSuccess: false,
  isError: false,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  try {
    const response = await axios.get(`${backendAPI}/users/getAll`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const fetchUserById = createAsyncThunk('users/fetchUserById', async (id) => {
  try {
    const response = await axios.get(`${backendAPI}/users/getById/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const createUser = createAsyncThunk('users/createUser', async (newUser) => {
  try {
    const response = await axios.post(`${backendAPI}/users/create`, newUser);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const editUser = createAsyncThunk('users/editUser', async ({ id, updatedUser }) => {
  try {
    const response = await axios.put(`${backendAPI}/users/edit/${id}`, updatedUser);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  try {
    const response = await axios.delete(`${backendAPI}/users/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUsers: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.users = [action.payload]; // Assuming the fetched data is an object with user details
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.users = state.users.filter(user => user._id !== action.payload._id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  },
});

export const { resetUsers, updateUsers } = userSlice.actions;

export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;

export default userSlice.reducer;
