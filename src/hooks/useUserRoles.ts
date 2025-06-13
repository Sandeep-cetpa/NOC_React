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
    isDandAR: true,
    isVigilanceAdmin: false,
    isCorporateUnitHr: false,
    isGm: false,
  };
};

export default useUserRoles;
