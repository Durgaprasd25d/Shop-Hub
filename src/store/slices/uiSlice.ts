import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  darkMode: boolean;
  selectedProduct: number | null;
  isSidebarOpen: boolean;
}

const initialState: UIState = {
  darkMode: false,
  selectedProduct: null,
  isSidebarOpen: false, // Sidebar initially closed
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { toggleDarkMode, toggleSidebar, setSelectedProduct } = uiSlice.actions;
export default uiSlice.reducer;
