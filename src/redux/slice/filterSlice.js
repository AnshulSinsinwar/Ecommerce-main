import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
  name: "filter",
  initialState: {
    searchQuery: "",
    selectedCategory: "all",
    sortBy: "default"
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    }
  }
});

export const { setSearchQuery, setSelectedCategory, setSortBy } = filterSlice.actions;
export default filterSlice.reducer;
