import axiosInstance from '@/services/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface StatusMap {
  statusId: number;
  statusName: string;
}

interface allStatus {
  allStatus: any | [];
  status: boolean;
  error: string | null;
}

// ⏳ Initial state
const initialState: allStatus = {
  allStatus: [],
  status: false,
  error: null,
};

// 🔁 Async thunk to fetch purpose/status map
export const fetchStatus = createAsyncThunk<
  StatusMap, // Return type
  void,
  { rejectValue: string }
>('purpose/fetchStatus', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/User/NOC/GetAllStatus`);
    return response.data as StatusMap;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
  }
});

const statusSlice = createSlice({
  name: 'purpose',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatus.pending, (state) => {
        state.status = true;
        state.error = null;
      })
      .addCase(fetchStatus.fulfilled, (state, action: PayloadAction<StatusMap>) => {
        state.status = false;
        console.log(action.payload, 'dsgg');
        // Transform to array of objects
        const statusArray = Object.entries(action.payload).map(([statusId, statusName]) => ({
          statusId,
          statusName,
        }));
        const uniqueStatusArray = Array.from(new Map(statusArray.map((item) => [item.statusName, item])).values());
        state.allStatus = uniqueStatusArray;
      })
      .addCase(fetchStatus.rejected, (state, action) => {
        state.status = false;
        state.error = action.payload || 'Failed to fetch purpose';
      });
  },
});

export default statusSlice.reducer;
