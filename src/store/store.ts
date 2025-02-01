import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import uiReducer from "./slices/uiSlice";
import { persistCartState } from "./store/persistCartState ";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    ui: uiReducer, // Ensure uiReducer is added here
  },
  preloadedState: {
    cart: persistCartState(),
  },
});

// Persist cart state to localStorage whenever it changes
store.subscribe(() => {
  const cartState = store.getState().cart;
  localStorage.setItem('cart', JSON.stringify(cartState)); // Save the entire cart state
});

// Export the RootState type which represents the entire Redux state
export type RootState = ReturnType<typeof store.getState>;

// Export the AppDispatch type for dispatch actions
export type AppDispatch = typeof store.dispatch;
