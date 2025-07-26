import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "config",
  initialState: {
    orgName: "test",
    topbarColor: "#1976d2",
    logo: null,  // Should be a string URL (e.g., "/static/logo.png")
    logoPreview: null,  // Base64 string when uploading a new logo
  },
  reducers: {
    setOrgName: (state, action) => {
      state.orgName = action.payload;
    },
    setTopbarColor: (state, action) => {
      state.topbarColor = action.payload;
    },
    setLogo: (state, action) => {
      state.logo = action.payload;
    },
    setLogoPreview: (state, action) => {
      state.logoPreview = action.payload;
    },
  },
});

export const { setOrgName, setTopbarColor, setLogo, setLogoPreview } = configSlice.actions;
export default configSlice.reducer;
