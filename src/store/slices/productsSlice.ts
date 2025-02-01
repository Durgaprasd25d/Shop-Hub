import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface ProductsState {
  items: Product[];
  categories: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentCategory: string | null;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: ProductsState = {
  items: [],
  categories: [],
  status: 'idle',
  error: null,
  currentCategory: null,
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 8,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  return response.json();
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await fetch('https://fakestoreapi.com/products/categories');
  return response.json();
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.currentCategory = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setCategory, setSearchQuery, setCurrentPage } = productsSlice.actions;
export default productsSlice.reducer;