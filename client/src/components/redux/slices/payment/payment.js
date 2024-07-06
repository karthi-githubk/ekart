import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (items, { rejectWithValue }) => {
    try {
 
      const response = await axios.post(`${process.env.backendAPI}/create-payment-intent`, { items });
      return response.data.clientSecret; 
    } catch (error) {
      
      return rejectWithValue(error.response.data); 
    }
  }
);


const initialState = {
  clientSecret: null, 
  status: 'idle',
  error: null, 
};


const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
   
      .addCase(createPaymentIntent.pending, (state) => {
        state.status = 'loading'; 
      })
     
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.status = 'succeeded'; 
        state.clientSecret = action.payload; 
      })
     
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.status = 'failed'; 
        state.error = action.payload; 
      });
  },
});


export default paymentSlice.reducer;
