import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Profile {
  exp: number | null;
  iss: string | null;
  aud: string | null;
  iat: number | null;
  s_hash: string | null;
  sid: string | null;
  sub: string | null;
  idp: string | null;
  name: string | null;
  email: string | null;
  email_verified: string | null;
  display_name: string | null;
  UserId: string | null;
  username: string | null;
  preferred_username: string | null;
  EmailId: string | null;
  UnitName: string | null;
  UnitId: string | null;
  Department: string | null;
  Designation: string | null;
  Level: string | null;
  role: string | null;
}

export interface AuthState {
  id_token: string | null;
  session_state: string | null;
  access_token: string | null;
  token_type: string | null;
  scope: string | null;
  profile: Profile;
  expires_at: number | null;
}

const initialState: AuthState = {
  id_token: null,
  session_state: null,
  access_token: null,
  token_type: null,
  scope: null,
  profile: {
    exp: null,
    iss: null,
    aud: null,
    iat: null,
    s_hash: null,
    sid: null,
    sub: null,
    idp: null,
    name: null,
    email: null,
    email_verified: null,
    display_name: null,
    UserId: null,
    username: null,
    preferred_username: null,
    EmailId: null,
    UnitName: null,
    UnitId: null,
    Department: null,
    Designation: null,
    Level: null,
    role: null,
  },
  expires_at: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<AuthState>) => {
      return { ...state, ...action.payload };
    },
    updateAuthData: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload };
    },
    resetAuthData: () => initialState,
  },
});

export const { setAuthData, updateAuthData, resetAuthData } = authSlice.actions;

export default authSlice.reducer;
