'use client';

import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './CartSlice';
import fetchSlice from './FetchSlice';
console.log('fetchSlice', fetchSlice);
export const store = configureStore({
  reducer: {
    cart: cartSlice,
    products: fetchSlice,
  },
});
