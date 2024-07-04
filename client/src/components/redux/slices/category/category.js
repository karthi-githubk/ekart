import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendAPI = 'http://localhost:5005';


const initialState = {
  categories: [],
  loading: false,
  error: null,
  isSuccess: false,
  isError: false,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    try {
      const response = await axios.get(`${backendAPI}/categories/getAll`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  });
  

export const fetchCategoryById = createAsyncThunk('categories/fetchCategoryById', async (id) => {
  try {
    const response = await axios.get(`${backendAPI}/categories/getById/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const createCategory = createAsyncThunk('categories/createCategory', async (newCategory) => {
    try {
      const response = await axios.post(`${backendAPI}/categories/create`, newCategory);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  });
  

export const editCategory = createAsyncThunk('categories/editCategory', async ({ id, updatedCategory }) => {
  try {
    const response = await axios.put(`${backendAPI}/categories/edit/${id}`, updatedCategory);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id) => {
  try {
    const response = await axios.delete(`${backendAPI}/categories/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategories: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
    updateCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = [action.payload]; // Assuming the fetched data is an object with category details
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter(category => category._id !== action.payload._id);
      })
      
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  },
});

export const { resetCategories, updateCategories } = categorySlice.actions;

export const selectCategories = (state) => state.categories.categories;
export const selectCategoriesLoading = (state) => state.categories.loading;

export default categorySlice.reducer;
