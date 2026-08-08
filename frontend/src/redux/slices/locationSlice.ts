import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import URLs from "../../configs/URLs";

export const fetchLocation = createAsyncThunk("location/fetchLocation", async (_, { rejectWithValue }) => {
  return new Promise<string>((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(rejectWithValue("Geolocation is not supported by your browser"));
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `${URLs.getLocation}?latitude=${coords.latitude}&longitude=${coords.longitude}`,
          );
          if (!res.ok) {
            throw new Error("Failed to fetch reverse geocoding data");
          }
          const data = await res.json();
          const addr = data?.address || {};
          const detectedCity =
            addr.city ||
            addr.town ||
            addr.municipality ||
            addr.suburb ||
            addr.village ||
            addr.state_district ||
            addr.county ||
            addr.state ||
            "Hyderabad";

          resolve(detectedCity);
        } catch (err: any) {
          reject(rejectWithValue(err.message || "Failed to resolve address"));
        }
      },
      (err) => {
        let msg = "Failed to detect location";
        if (err.code === err.PERMISSION_DENIED) {
          msg = "Location permission denied";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = "Position unavailable";
        } else if (err.code === err.TIMEOUT) {
          msg = "Location request timed out";
        }
        reject(rejectWithValue(msg));
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  });
});

interface LocationState {
  city: string;
  loading: boolean;
  error: string;
}

const initialState: LocationState = {
  city: "Hyderabad",
  loading: false,
  error: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
      state.error = "";
      state.loading = false;
    },
    clearLocationError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocation.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.city = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || "Failed to fetch location";
        state.loading = false;
      });
  },
});

export const { setCity, clearLocationError } = locationSlice.actions;
export default locationSlice.reducer;