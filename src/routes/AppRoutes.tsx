import { Routes, Route, Navigate } from 'react-router';
import PrivateRoute from './PrivateRoute';
import NotFound from '@/pages/notFound/NotFound';
import ManageRoles from '@/pages/admin/ManageRoles';
import CreateRequest from '@/pages/employee/CreateRequest';
import TrackNoc from '@/pages/employee/TrackNoc';
import NocRequestForEmployee from '@/pages/UnitHr/NocRequestForEmployee';
import FrontChannelLogout from '@/auth/FrontChannelLogout';
import RequestReceived from '@/pages/cgm/RequestReceived';
import ProcessedRequestByCgm from '@/pages/cgm/ProcessedRequestByCgm';
import PendingNocRequests from '@/pages/UnitHr/PendingNocRequests';
import ProcessedNocRequests from '@/pages/UnitHr/ProcessedNocRequests';
import ReceivedRequests from '@/pages/CorporateUnitHr/ReceivedRequests';
import RequestUnderProcess from '@/pages/CorporateUnitHr/RequestUnderProcess';
import NocRequestsFromVigilance from '@/pages/CorporateUnitHr/NocRequestsFromVigilance';
import RoleManagement from '@/pages/VigilanceAdmin/RoleManagement';
import ManageGreyList from '@/pages/VigilanceAdmin/ManageGreyList';
import VigilanceRequestReceived from '@/pages/VigilanceAdmin/VigilanceAdminRequestReceived';
import ProcessedRequest from '@/pages/VigilanceAdmin/ProcessedRequestVigilanceAdmin';
import DandArPendingRequests from '@/pages/DandAR/DandArPendingRequests';
import GmProcessedRequests from '@/pages/gm/GmProcessedRequests';
import GmRejectedRequests from '@/pages/gm/GmRejectedRequests';
import GmREquesteReceived from '@/pages/gm/GmREquesteReceived';
import Dashboard from '@/pages/admin/Dashboard';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '@/features/masterData/masterSlice';
import { AppDispatch, RootState } from '@/app/store';
import NocRequestForEmployeeByCorporateHr from '@/pages/CorporateUnitHr/NocRequestForEmployeeByCorporateHr';
import NocRequestForEmployeeByDandAR from '@/pages/DandAR/NocRequestForEmployeeByDandAR';
import AppLayout from '@/components/layout/app-layout';
import Unauthorized from '@/pages/unauthorized/Unauthorized';
import RequestReceivedVigilanceUser from '@/pages/VigilanceUser/RequestReceivedVigilanceUser';
import ProcessedRequestVigilanceUser from '@/pages/VigilanceUser/ProcessedRequestVigilanceUser';
import VigilanceAdminRequestReceived from '@/pages/VigilanceAdmin/VigilanceAdminRequestReceived';
import DandARNocRequestsFromVigilance from '@/pages/DandAR/DandARNocRequestsFromVigilance';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const masterData = useSelector((state: RootState) => state.masterData.data);
  useEffect(() => {
    if (isAuthenticated && !masterData.departments.length) {
      dispatch(fetchMasterData());
    }
  }, [isAuthenticated, masterData]);
  return (
    <Routes>
      <Route path="/logout-notification" element={<FrontChannelLogout />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route element={<AppLayout isAdmin={false} />}>
        <Route element={<PrivateRoute allowedRoles={[]} />}>
          <Route path="/" element={<Navigate to="/create-request" replace={true} />} />
          <Route path="/track-noc" element={<TrackNoc />} />
          <Route path="/create-request" element={<CreateRequest />} />
          <Route path="/noc-request-for-employee" element={<NocRequestForEmployee />} />
        </Route>
      </Route>
      <Route element={<AppLayout isAdmin={true} />}>
        <Route element={<PrivateRoute allowedRoles={['admin', 'superAdmin']} />}>
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/admin-manage-role" element={<ManageRoles />} />
        </Route>
      </Route>
      <Route element={<AppLayout isAdmin={true} />}>
        <Route element={<PrivateRoute allowedRoles={['CGM']} />}>
          <Route path="/cgm-request-received" element={<RequestReceived />} />
          <Route path="/cgm-processed-request" element={<ProcessedRequestByCgm />} />
        </Route>
      </Route>
      <Route element={<AppLayout isAdmin={true} />}>
        <Route element={<PrivateRoute allowedRoles={['HrUser']} />}>
          <Route path="/unit-hr-request-for-employee" element={<NocRequestForEmployee />} />
          <Route path="/unit-hr-pending-noc-requests" element={<PendingNocRequests />} />
          <Route path="/unit-hr-processed-noc-requests" element={<ProcessedNocRequests />} />
        </Route>
      </Route>
      <Route element={<AppLayout isAdmin={true} />}>
        <Route element={<PrivateRoute allowedRoles={['HrUser']} />}>
          <Route path="/corporate-unit-hr-received-requests" element={<ReceivedRequests />} />
          <Route path="/corporate-unit-hr-request-under-process" element={<RequestUnderProcess />} />
          <Route path="/corporate-unit-hr-noc-requests-from-vigilance" element={<NocRequestsFromVigilance />} />
          <Route path="/corporate-unit-hr-request-for-employee" element={<NocRequestForEmployeeByCorporateHr />} />
        </Route>
      </Route>
      <Route element={<AppLayout isAdmin={true} />}>
        <Route element={<PrivateRoute allowedRoles={['VigilanceAdmin']} />}>
          <Route path="/vigilance-admin-role-management" element={<RoleManagement />} />
          <Route path="/vigilance-admin-manage-grey-list" element={<ManageGreyList />} />
          <Route path="/vigilance-admin-request-received" element={<VigilanceAdminRequestReceived />} />
          <Route path="/vigilance-admin-processed-request" element={<ProcessedRequest />} />
        </Route>
      </Route>
      <Route element={<AppLayout isAdmin={true} />}>
        <Route element={<PrivateRoute allowedRoles={['VigilanceUser']} />}>
          <Route path="/vigilance-user-request-received" element={<RequestReceivedVigilanceUser />} />
          <Route path="/vigilance-user-processed-request" element={<ProcessedRequestVigilanceUser />} />
        </Route>
      </Route>
      <Route element={<AppLayout isAdmin={true} />}>
        <Route element={<PrivateRoute allowedRoles={['DandAR']} />}>
          <Route path="/d-and-ar-pending-requests" element={<DandArPendingRequests />} />
          <Route path="/d-and-ar-raise-requests" element={<NocRequestForEmployeeByDandAR />} />
          <Route path="/d-and-ar-request-from-vigilance" element={<DandARNocRequestsFromVigilance />} />
        </Route>
      </Route>
      <Route element={<AppLayout isAdmin={true} />}>
        <Route element={<PrivateRoute allowedRoles={['']} />}>
          <Route path="/gm-request-received" element={<GmREquesteReceived />} />
          <Route path="/gm-processed-requests" element={<GmProcessedRequests />} />
          <Route path="/gm-rejected-requests" element={<GmRejectedRequests />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
