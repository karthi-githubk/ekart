import { configureStore } from "@reduxjs/toolkit";
import userSignInSlice from "./slices/user/signin.js";
import categorySlice from "./slices/category/category.js";
import productSlice from "./slices/product/product.js";
import usersSlice from "./slices/users/users.js";
import wishlistSlice from "./slices/Items/wishlist.js";
import cartSlice from "./slices/Items/cart.js";
import contactSlice from "./slices/contact/contact.js";
import paymentSlice from './slices/payment/payment.js';

export default configureStore({
  reducer: {
    userSignIn: userSignInSlice,
    categories: categorySlice,
    products: productSlice,
    users: usersSlice,
    wishlist: wishlistSlice,
    cart: cartSlice,
    contacts: contactSlice,
    payment:paymentSlice,
  },
});
