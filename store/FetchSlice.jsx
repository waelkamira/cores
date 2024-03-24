'use client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  data: [],
};

const fetchSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // fetchProducts: (state, action) => {
    //   state.data = action.payload;
    //   console.log('state', state);
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { fetchProducts } = fetchSlice.actions;
export default fetchSlice.reducer;

export const getProducts = createAsyncThunk('products/get', async () => {
  const data = await fetch('https://fakestoreapi.com/products');
  const products = await data.json();
  return products;
});

// export function getProducts() {
//   return async function getProductsThunk(dispatch, getState) {
//     const data = await fetch('https://fakestoreapi.com/products');
//     const products = await data.json();
//     dispatch(fetchProducts(products));
//   };
// }
