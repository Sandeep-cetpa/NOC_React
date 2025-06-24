import axiosInstance from '@/services/axiosInstance';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface UserState {
  Roles: any[] | null;
  unique_name: string | null;
  EmpID: number | null;
  EmpCode: string | null;
  Designation: string | null;
  Unit: string | null;
  unitId: string | null;
  Lavel: string | null;
  Department: string | null;
  exp: number | null;
  loading: boolean;
  error: string | null;
}

interface ProfileResponse {
  employeeInfo: {
    employeeMasterAutoId: number;
    employeeCode: string;
    gender: string;
    userName: string;
    post: string;
    genericDesignation: string;
    positions: number;
    positionGrade: string;
    deptDfccil: string;
    subDeptDf: string;
    dob: string;
    doretirement: string;
    location: string;
    dorecruiting: string | null;
    dojdfccil: string;
    dotends: string | null;
    depTenurecompletiondate: string | null;
    depExtensionuptodate: string | null;
    deputationTenure: string | null;
    dorepatriation: string | null;
    doabsorption: string | null;
    dofirstPromotion: string | null;
    dosecondPromotion: string | null;
    dothirdPromotion: string | null;
    doreemployment: string | null;
    doabsconding: string | null;
    toemploy: string;
    empSubgroup: string | null;
    ethnicOrigin: string | null;
    religion: string | null;
    rbfileNo: string | null;
    lastDesignation: string | null;
    services: string | null;
    ditsdoarailway: string | null;
    parentRailway: string | null;
    gazettedNonGazetted: string | null;
    doletter: string | null;
    personnelArea: string | null;
    personnelSubArea: string;
    mobile: string;
    pwd: string;
    emailAddress: string;
    status: number;
    modifyBy: string;
    modifyDate: string;
    modifyIp: string;
    userType: number;
    designation: string;
    aboutUs: string;
    extnNo: string | null;
    faxNo: string | null;
    mtnno: string | null;
    photo: string;
    anniversaryDate: string;
    personalMobile: string | null;
    personalEmailAddress: string;
    parentOrganzation: string | null;
    duration: string | null;
    reportingOfficer: string;
    fatherName: string;
  };
  vigilanceDetails: any[];
}

const initialState: UserState = {
  Roles: null,
  unique_name: null,
  EmpID: null,
  EmpCode: null,
  Designation: null,
  Unit: null,
  unitId: null,
  Lavel: null,
  Department: null,
  exp: null,
  loading: false,
  error: null,
};

// Create async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ProfileResponse>('/User/NOC/GetProfile');
    const data = response.data;
    if (data.error) {
      throw new Error(data.errorDetail || 'Unknown error occurred');
    }
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user profile');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    resetUser() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;

        const { employeeInfo, vigilanceDetails } = action.payload;
        state.EmpCode = employeeInfo.employeeCode;
        state.unique_name = employeeInfo.userName;
        state.Designation = employeeInfo.designation;
        state.EmpID = employeeInfo.employeeMasterAutoId;
        state.Unit = employeeInfo.location;
        state.unitId = employeeInfo?.unitId?.toString();
        state.Department = employeeInfo.deptDfccil;
        state.Lavel = employeeInfo.positionGrade;
        state.Roles = vigilanceDetails;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
