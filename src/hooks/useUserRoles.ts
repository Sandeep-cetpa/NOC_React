import { RootState } from '@/app/store';
import { useState } from 'react';
const useUserRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isAdmin = roles.includes('admin');
  const isUser = roles.includes('user');
  return {
    isSuperAdmin: false,
    isAdmin,
    isUser,
    roles,
    isLoading,
    isUnitHr: false,
    isCgm: false,
    isDandAR: false,
    isVigilanceAdmin: true,
    isCorporateUnitHr: false,
    isGm: false, //2 table are pending for this role
  };
};

export default useUserRoles;
