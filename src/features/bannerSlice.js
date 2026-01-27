import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bannerService } from '../services/bannerService';

// Async thunks
export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const data = await bannerService.getBanners();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải banner');
    }
  }
);

export const fetchAllBanners = createAsyncThunk(
  'banners/fetchAllBanners',
  async (params, { rejectWithValue }) => {
    try {
      const data = await bannerService.getAllBanners(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách banner');
    }
  }
);

export const createBanner = createAsyncThunk(
  'banners/createBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      const data = await bannerService.createBanner(bannerData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo banner');
    }
  }
);

export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      const data = await bannerService.updateBanner(id, bannerData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật banner');
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banners/deleteBanner',
  async (id, { rejectWithValue }) => {
    try {
      await bannerService.deleteBanner(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa banner');
    }
  }
);

export const reorderBanners = createAsyncThunk(
  'banners/reorderBanners',
  async (bannerOrders, { rejectWithValue }) => {
    try {
      const data = await bannerService.reorderBanners(bannerOrders);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật thứ tự');
    }
  }
);

const initialState = {
  banners: [],
  allBanners: [],
  loading: false,
  error: null,
  success: false,
  currentIndex: 0, // For carousel navigation
};

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    nextBanner: (state) => {
      if (state.banners.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.banners.length;
      }
    },
    prevBanner: (state) => {
      if (state.banners.length > 0) {
        state.currentIndex = (state.currentIndex - 1 + state.banners.length) % state.banners.length;
      }
    },
    goToBanner: (state, action) => {
      if (action.payload >= 0 && action.payload < state.banners.length) {
        state.currentIndex = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch banners (public)
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.banners || [];
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all banners (admin)
    builder
      .addCase(fetchAllBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.allBanners = action.payload.banners || [];
      })
      .addCase(fetchAllBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create banner
    builder
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allBanners.push(action.payload.banner);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update banner
    builder
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.allBanners.findIndex(
          (b) => b._id === action.payload.banner._id
        );
        if (index !== -1) {
          state.allBanners[index] = action.payload.banner;
        }
        // Update in banners list too if exists
        const bannerIndex = state.banners.findIndex(
          (b) => b._id === action.payload.banner._id
        );
        if (bannerIndex !== -1) {
          state.banners[bannerIndex] = action.payload.banner;
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete banner
    builder
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allBanners = state.allBanners.filter((b) => b._id !== action.payload);
        state.banners = state.banners.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Reorder banners
    builder
      .addCase(reorderBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderBanners.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(reorderBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, setCurrentIndex, nextBanner, prevBanner, goToBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
