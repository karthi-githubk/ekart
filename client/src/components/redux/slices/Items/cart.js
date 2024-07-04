import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingProductIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (existingProductIndex === -1) {
        state.items.push({ ...action.payload, quantity: 1 }); // Initialize quantity to 1 when adding to cart
        localStorage.setItem("cart", JSON.stringify(state.items));
        console.log("Product added to cart:", action.payload);
      } else {
        console.log("Product already in cart:", action.payload);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
      console.log("Product removed from cart:", action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
      console.log("Cart cleared");
    },
    updateQuantity: (state, action) => {
      const { productId, newQuantity } = action.payload;
      const itemToUpdate = state.items.find((item) => item._id === productId);
      if (itemToUpdate) {
        itemToUpdate.quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export default cartSlice.reducer;
