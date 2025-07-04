import axiosInstance from '@/services/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Unit {
  unitid: number;
  unitName: string;
  sectionId: number | null;
  status: string | null;
  ip: string | null;
  createDate: string | null;
  createBy: string | null;
  sequenceId: number | null;
  abbrivation: string | null;
  authenticatedUsers: any[]; // You can type this properly if you know the structure
}

interface MasterData {
  units: Unit[];
  departments: string[];
  posts: string[];
  grades: string[];
}

interface MasterState {
  data: MasterData;
  loading: boolean;
  error: string | null;
}

const initialState: MasterState = {
  data: {
    units: [],
    departments: [],
    posts: [],
    grades: [],
  },
  loading: false,
  error: null,
};

// ✅ Async thunk
export const fetchMasterData = createAsyncThunk<MasterData, void, { rejectValue: string }>(
  'master/fetchMasterData',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/Util/constant-data');
      return response.data.data as MasterData;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterData.fulfilled, (state, action: PayloadAction<MasterData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch master data';
      });
  },
});

export default masterSlice.reducer;
