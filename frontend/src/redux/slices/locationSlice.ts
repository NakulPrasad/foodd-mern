import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchLocation = createAsyncThunk("location", async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not enabled");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const res = await fetch(
          `http://localhost:3000/apiv1/home/getLocation?latitude=${coords.latitude}&longitude=${coords.longitude}`,
        );
        const data = await res.json();
        const addr = data.address;
        resolve(addr.state_district || "Unknown");
      },
      (err) => reject(err.message),
    );
  });
});

const initialState = {
  city: "Hyderabad",
  loading: false,
  error: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
    reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocation.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.city = action.payload as unknown as string;
        state.loading = false;
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch location";
        state.loading = false;
      });
  },
});

export default locationSlice.reducer;