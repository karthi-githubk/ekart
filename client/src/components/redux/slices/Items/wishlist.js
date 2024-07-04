import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("wishlist")) || [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const existingProduct = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (!existingProduct) {
        state.items.push(action.payload);
        localStorage.setItem("wishlist", JSON.stringify(state.items));

        console.log("Product added to wishlist:", action.payload);
      }
      console.log("Updated wishlist:", state.items);
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem("wishlist", JSON.stringify(state.items));

      console.log("Product removed from wishlist:", action.payload);
      console.log("Updated wishlist:", state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export const selectWishlist = (state) => state.wishlist.items;
export default wishlistSlice.reducer;