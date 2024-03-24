'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add: (state, action) => {
      state.push(action.payload);
      localStorage?.setItem('cartProducts', JSON.stringify(state));
    },
    del: (state, action) => {
      const products =
        window !== 'undefined'
          ? JSON.parse(localStorage?.getItem('cartProducts'))
          : '';
      console.log('products', products);
      state = products.filter((item) => {
        return item.id !== action.payload;
      });
      console.log('state', state);
      localStorage?.setItem('cartProducts', JSON.stringify(state));
      location.reload();
    },
  },
});

export const { add, del } = cartSlice.actions;
export default cartSlice.reducer;
