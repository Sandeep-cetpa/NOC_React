import { Routes, Route, Navigate } from 'react-router';
import PrivateRoute from './PrivateRoute';
import NotFound from '@/pages/notFound/NotFound';
import Login from '@/pages/auth/Home';
import Forms from '@/pages/admin/Forms';
import AdminPrivateRoute from './AdminPrivateRoute';
import ManageRoles from '@/pages/admin/ManageRoles';
import CreateRequest from '@/pages/employee/CreateRequest';
import TrackNoc from '@/pages/home/TrackNoc';
import NocRequestForEmployee from '@/pages/employee/NocRequestForEmployee';
import FrontChannelLogout from '@/auth/FrontChannelLogout';

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
