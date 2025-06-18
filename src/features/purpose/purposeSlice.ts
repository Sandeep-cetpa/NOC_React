import { environment } from '@/config';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

type purposeVisibility = {
  id: number;
  unitId: string;
  unitName: string;
  department: string;
  grade: string;
  empType: string;
  createdDate: string;
  modifiedDate: string;
  isActive: boolean;
  purposeId: number;
  purposeName: string | null;
};

type purpose = {
  id: number;
  categoryId: number | null;
  name: string;
  hindiName: string | null;
  icon: string | null;
  sortingOrder: number;
  description: string | null;
  appUrl: string | null;
  bgColor: string | null;
  createdDate: string;
  modifiedDate: string;
  isActive: boolean;
  purposeVisibilities: purposeVisibility[];
  favorites: any | null;
};



interface purposeState {
  purpose: purpose[];
  status: boolean;
  error: string | null;
}

// ⏳ Initial state
const initialState: purposeState = {
  purpose: [],
  status: false,
  error: null,
};

// 🔁 Async thunk to fetch purpose
export const fetchPurpose = createAsyncThunk<
  purpose[], // Return type
  void,
  { rejectValue: string }
>('purpose/fetchpurpose', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${environment.apiUrl}/vig/getformgenerationdata`);
    return response.data.data as purpose[];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
  }
});

const purposeSlice = createSlice({
  name: 'purpose',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurpose.pending, (state) => {
        state.status = true;
        state.error = null;
      })
      .addCase(fetchPurpose.fulfilled, (state, action: PayloadAction<purpose[]>) => {
        state.status = false;
        state.purpose = action.payload;
      })
      .addCase(fetchPurpose.rejected, (state, action) => {
        state.status = false;
        state.error = action.payload || 'Failed to fetch purpose';
      });
  },
});

export default purposeSlice.reducer;
