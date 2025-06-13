import { RootState } from '@/app/store';
import { useState } from 'react';
const useUserRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isAdmin = roles.includes('admin');
  const isUser = roles.includes('user');
  return {
    isSuperAdmin: true,
    isAdmin,
    isUser,
    roles,
    isLoading,
    isUnitHr: true,
    isCgm: true,
    isDandAR: true,
    isVigilanceAdmin: true,
    isCorporateUnitHr: true,
    isGm: true,
  };
};

export default useUserRoles;
