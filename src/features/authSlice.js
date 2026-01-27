import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import { setToken, removeToken, getUserFromToken, saveUser, getUser, removeUser } from '../utils/helpers';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      
      // CRITICAL: Save token and user data immediately
      if (data.token) {
        setToken(data.token);
      }
      
      // Extract and persist user contact information
      if (data.user) {
        const userData = {
          id: data.user.id || data.user._id,
          email: data.user.email,
          phone: data.user.phone,
          name: data.user.name,
          avatar: data.user.avatar,
          role: data.user.role,
        };
        saveUser(userData);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      
      // CRITICAL: Save token and user data immediately
      if (data.token) {
        setToken(data.token);
      }
      
      // Extract and persist user contact information
      if (data.user) {
        const userDataToSave = {
          id: data.user.id || data.user._id,
          email: data.user.email,
          phone: data.user.phone,
          name: data.user.name,
          avatar: data.user.avatar,
          role: data.user.role,
        };
        saveUser(userDataToSave);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getCurrentUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
  }
);

// Get initial state from token and localStorage
const getInitialState = () => {
  // Priority 1: Try to get user from localStorage (most complete data)
  let user = getUser();
  
  // Priority 2: If no localStorage user, try to get from token
  if (!user) {
    user = getUserFromToken();
  }
  
  // If we have user from token but not localStorage, save it
  if (user && !getUser()) {
    saveUser(user);
  }
  
  return {
    user: user,
    isAuthenticated: !!user,
    isLoading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      // CRITICAL: Clear all auth-related data
      removeToken();
      removeUser(); // Remove user from localStorage
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Note: Cart clearing is handled in useAuth hook to dispatch clearCart action
      // This ensures proper order of operations
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        // Use user from payload, or fallback to localStorage
        state.user = action.payload.user || getUser();
        state.isAuthenticated = true;
        
        // Ensure user is saved to localStorage
        if (state.user) {
          saveUser(state.user);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        // Use user from payload, or fallback to localStorage
        state.user = action.payload.user || getUser();
        state.isAuthenticated = true;
        
        // Ensure user is saved to localStorage
        if (state.user) {
          saveUser(state.user);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        
        // Update localStorage with latest user data
        if (state.user) {
          saveUser(state.user);
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
