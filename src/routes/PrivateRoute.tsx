import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from 'react-oidc-context';
import Loader from '@/components/ui/loader';
import { useDispatch } from 'react-redux';
import { setAuthData } from '@/features/auth/authSlice';
import { fetchUserProfile } from '@/features/user/userSlice';
import { useAppSelector } from '@/app/hooks';
import AppLayout from '@/components/layout/app-layout';
const PrivateRoute: React.FC = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading: userLoading } = useAppSelector((state) => state.user);
  const isAuthenticated = auth.isAuthenticated;
  const isInitializing = auth.isLoading;
  const redirectHandled = useRef(false);

  // useEffect(() => {
  //   if (!isAuthenticated && !isInitializing && !redirectHandled.current) {
  //     redirectHandled.current = true;
  //     auth.signinRedirect({
  //       state: { returnUrl: location.pathname + location.search },
  //     });
  //   }
  // }, [isAuthenticated, isInitializing, location.pathname, location.search, auth]);

  // useEffect(() => {
  //   if (isAuthenticated && auth.user && !redirectHandled.current) {
  //     redirectHandled.current = true;

  //     dispatch(setAuthData(auth.user));
  //     dispatch(fetchUserProfile());

  //     const returnUrl = auth.user?.state?.returnUrl;
  //     navigate(returnUrl, { replace: true });
  //   }
  // }, [isAuthenticated, auth.user, dispatch, navigate]);

  // // Show loading if OIDC or user profile is still loading
  // if (isInitializing || !isAuthenticated || userLoading) {
  //   return <Loader />;
  // }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default PrivateRoute;
