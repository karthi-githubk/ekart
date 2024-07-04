import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendAPI = "http://localhost:5005";

const initialState = {
  products: [],
  loading: false,
  error: null,
  isSuccess: false,
  isError: false,
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  try {
    const response = await axios.get(`${backendAPI}/products/getAll`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    try {
      const response = await axios.get(`${backendAPI}/products/getById/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (newProduct) => {
    try {
      const response = await axios.post(`${backendAPI}/products/create`, newProduct);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, updatedProduct }) => {
    try {
      const response = await axios.put(
        `${backendAPI}/products/edit/${id}`,
        updatedProduct
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id) => {
  try {
    const response = await axios.delete(`${backendAPI}/products/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
    updateProducts: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [action.payload];
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.products = state.products.filter(
          (product) => product._id !== action.payload._id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  },
});

export const { resetProducts, updateProducts } = productSlice.actions;

export const selectProducts = (state) => state.products.products;
export const selectProductsLoading = (state) => state.products.loading;
export const selectTotalProducts = (state) => selectProducts(state).length; // New selector

export default productSlice.reducer;
