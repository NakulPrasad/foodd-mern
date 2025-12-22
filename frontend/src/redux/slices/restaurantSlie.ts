import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setSelectedRestaurant: (state, action) => {
      state.selected = action.payload;
    },
    clearSelctedRestaurant: (state) => {
      state.selected = null;
    },
  },
});

export const { setSelectedRestaurant, clearSelctedRestaurant } =
  restaurantSlice.actions;
export default restaurantSlice.reducer;
