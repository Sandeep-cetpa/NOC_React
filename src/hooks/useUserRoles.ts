import { RootState } from '@/app/store';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '@/services/axiosInstance';

interface RoleResponse {
  statusCode: number;
  message: string;
  data: string[];
  dataLength: number;
  totalRecords: number;
  error: boolean;
  errorDetail: null | string;
}

const useUserRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const isNodalOfficer = roles.includes('nodalofficer');
  const isSuperAdmin = roles.includes('superadmin');
  const isAdmin = roles.includes('admin');
  const isUnitCGM = roles.includes('unitcgm');
  const isHOD = roles.includes('hod');
  const isUser = roles.includes('user');
  const isAddressal = roles.includes('redressal');
  const isCommittee = roles.includes('committee');
  const isUnitHr = roles.includes('unithr');
  const isGm = roles.includes('gm');

  return {
    isNodalOfficer,
    isSuperAdmin: true,
    isAdmin,
    isUnitCGM,
    isHOD,
    isAddressal,
    isCommittee,
    isUser,
    roles,
    isLoading,
    isUnitHr: false,
    isCgm: false,
    isDandAR: false,
    isVigilanceAdmin: false,
    isCorporateUnitHr: false,
    isGm: false,
  };
};

export default useUserRoles;
