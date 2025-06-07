import { Routes, Route, Navigate } from 'react-router';
import PrivateRoute from './PrivateRoute';
import NotFound from '@/pages/notFound/NotFound';
import Forms from '@/pages/admin/Forms';
import AdminPrivateRoute from './AdminPrivateRoute';
import ManageRoles from '@/pages/admin/ManageRoles';
import CreateRequest from '@/pages/employee/CreateRequest';
import TrackNoc from '@/pages/employee/TrackNoc';
import NocRequestForEmployee from '@/pages/employee/NocRequestForEmployee';
import FrontChannelLogout from '@/auth/FrontChannelLogout';
import RequestReceived from '@/pages/cgm/RequestReceived';
import ProcessedRequestByCgm from '@/pages/cgm/ProcessedRequestByCgm';
import CgmPrivateRoute from './CgmPrivateRoute';
import DAndARPrivateRoute from './DAndARPrivateRoute';
import UnitHrPrivateRoute from './UnitHrPrivateRoute';
import PendingNocRequests from '@/pages/UnitHr/PendingNocRequests';
import ProcessedNocRequests from '@/pages/UnitHr/ProcessedNocRequests';
import CorporateUnitHrPrivateRoute from './CorporateUnitHrPrivateRoute';
import VigilanceAdminPrivateRoute from './VigilanceAdminPrivateRoute';
import ReceivedRequests from '@/pages/CorporateUnitHr/ReceivedRequests';
import RequestUnderProcess from '@/pages/CorporateUnitHr/RequestUnderProcess';
import NocRequestsFromVigilance from '@/pages/CorporateUnitHr/NocRequestsFromVigilance';
import RejectedRequests from '@/pages/CorporateUnitHr/RejectedRequests';
import CompletedRequests from '@/pages/CorporateUnitHr/CompletedRequests';
import ParkedRequests from '@/pages/CorporateUnitHr/ParkedRequests';
import RoleManagement from '@/pages/VigilanceAdmin/RoleManagement';
import ManageGreyList from '@/pages/VigilanceAdmin/ManageGreyList';
import VigilanceRequestReceived from '@/pages/VigilanceAdmin/VigilanceRequestReceived';
import ProcessedRequest from '@/pages/VigilanceAdmin/ProcessedRequest';
import DandArPendingRequests from '@/pages/DandAR/DandArPendingRequests';
import DandArProcessedRequests from '@/pages/DandAR/DandArProcessedRequests';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/logout-notification" element={<FrontChannelLogout />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Navigate to="/create-request" replace={true} />} />
        <Route path="/track-noc" element={<TrackNoc />} />
        <Route path="/create-request" element={<CreateRequest />} />
        <Route path="/noc-request-for-employee" element={<NocRequestForEmployee />} />
      </Route>
      <Route element={<AdminPrivateRoute />}>
        <Route path="/form" element={<Forms />} />
        <Route path="/admin-manage-role" element={<ManageRoles />} />
      </Route>

      <Route element={<CgmPrivateRoute />}>
        <Route path="/cgm-request-received" element={<RequestReceived />} />
        <Route path="/cgm-processed-request" element={<ProcessedRequestByCgm />} />
      </Route>
      <Route element={<UnitHrPrivateRoute />}>
        <Route path="/unit-hr-request-for-employee" element={<NocRequestForEmployee />} />
        <Route path="/unit-hr-pending-noc-requests" element={<PendingNocRequests />} />
        <Route path="/unit-hr-processed-noc-requests" element={<ProcessedNocRequests />} />
      </Route>
      <Route element={<CorporateUnitHrPrivateRoute />}>
        <Route path="/corporate-unit-hr-received-requests" element={<ReceivedRequests />} />
        <Route path="/corporate-unit-hr-request-under-process" element={<RequestUnderProcess />} />
        <Route path="/corporate-unit-hr-noc-requests-from-vigilance" element={<NocRequestsFromVigilance />} />
        <Route path="/corporate-unit-hr-rejected-requests" element={<RejectedRequests />} />
        <Route path="/corporate-unit-hr-request-for-employee" element={<NocRequestForEmployee />} />
        <Route path="/corporate-unit-hr-completed-requests" element={<CompletedRequests />} />
        <Route path="/corporate-unit-hr-parked-requests" element={<ParkedRequests />} />
      </Route>
      <Route element={<VigilanceAdminPrivateRoute />}>
        <Route path="/vigilance-admin-role-management" element={<RoleManagement />} />
        <Route path="/vigilance-admin-manage-grey-list" element={<ManageGreyList />} />
        <Route path="/vigilance-admin-request-received" element={<VigilanceRequestReceived />} />
        <Route path="/vigilance-admin-processed-request" element={<ProcessedRequest />} />
      </Route>
      <Route element={<DAndARPrivateRoute />}>
        <Route path="/d-and-ar-pending-requests" element={<DandArPendingRequests />} />
        <Route path="/d-and-ar-processed-requests" element={<DandArProcessedRequests />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
