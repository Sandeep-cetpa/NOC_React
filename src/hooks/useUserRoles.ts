import { RootState } from '@/app/store';
import { useSelector } from 'react-redux';
const useUserRoles = () => {
  const userRoles = useSelector((state: RootState) => state?.user?.Roles) || [];
  const roleIds = userRoles?.map((role) => role?.roleId);
  const isAdmin = roleIds.includes(1); // Replace with actual Admin roleId
  const isSuperAdmin = roleIds.includes(2); // Replace with actual SuperAdmin roleId
  const isUnitHr = roleIds.includes(6); // Replace with actual UnitHr roleId
  const isCgm = roleIds.includes(8); // Replace with actual CGM roleId
  const isDandAR = roleIds.includes(7);
  const isVigilanceAdmin = roleIds.includes(4);
  const isVigilanceUser = roleIds.includes(4);
  const isCadreGm = roleIds.includes(10); // Replace with actual CorporateUnitHr roleId
  const isGm = roleIds.includes(9);
  const hrUser = roleIds.includes(3);
  const isUser = roleIds.includes(5);
  return {
    isSuperAdmin,
    isAdmin,
    isUser,
    roles: userRoles,
    isLoading: false,
    isUnitHr,
    isCgm,
    isDandAR,
    isVigilanceAdmin,
    isCadreGm,
    isVigilanceUser,
    isGm, //2 table are pending for this role
    hrUser, //2 table are pending for this role
  };
};

export default useUserRoles;
