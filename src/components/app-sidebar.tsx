import * as React from 'react';
import { LogOut, Hotel, ChevronsLeft, ChevronsRight, FileText, MonitorCog } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { environment } from '@/config';
import { Separator } from '@radix-ui/react-separator';
import { useNavigate } from 'react-router';
import { removeSessionItem } from '@/lib/helperFunction';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployeesData } from '@/features/employee/employeeSlice';
import toast from 'react-hot-toast';
import { setUnits } from '@/features/unit/unitSlice';
import { AppDispatch, RootState } from '@/app/store';
import { fetchStatus } from '@/features/status/statusSlice';
import { fetchApplications } from '@/features/applications/applicationsSlice';
import { useAuth } from 'react-oidc-context';
import { UserRole } from '@/types/auth';
import { useAppSelector } from '@/app/hooks';
import Loader from './ui/loader';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const employees = useSelector((state: RootState) => state.employee.employees);
  const status = useSelector((state: RootState) => state.allStatus.allStatus);
  const applications = useSelector((state: RootState) => state.applications.applications);
  const { loading: userLoading, Roles: userRoles } = useAppSelector((state) => state.user);
  const Roles = userRoles?.map((ele) => ele?.roleName);
  const canAccessAdminDashboard = (
    [
      'admin',
      'superAdmin',
      'CGM',
      'CMAdmin',
      'CMUser',
      'DandAR',
      'HrUser',
      'VigilanceAdmin',
      'VigilanceUser',
      'GM',
      'Cadre GM',
    ] as UserRole[]
  ).some((role) => Roles?.includes(role));
  const roleWiseUrlNavigation = {
    admin: '/admin-dashboard',
    superAdmin: '/admin-dashboard',
    CGM: '/cgm-request-received',
    CMAdmin: '',
    CMUser: '',
    DandAR: '/d-and-ar-pending-requests',
    HrUser: '/unit-hr-pending-noc-requests',
    VigilanceAdmin: '/vigilance-admin-role-management',
    VigilanceUser: '/vigilance-user-request-received',
    GM: '/gm-request-received',
    'Cadre GM': '/ggm-request-received',
  };
  const navMainItems = {
    navMain: [
      {
        title: 'Create Request',
        url: '/create-request',
        icon: FileText,
        items: [],
      },
      {
        title: 'Track NOC',
        url: '/track-noc',
        icon: MonitorCog,
        items: [],
      },
    ],
  };
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = async () => {
    try {
      const response = await fetch(`${environment.orgHierarchy}/Organization/GetOrganizationHierarchy`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      const result = data.data;
      dispatch(setEmployeesData(result));

      const units = result.map((employee: any) => ({
        unitName: employee.unitName,
        unitId: employee.unitId,
      }));

      const toSentenceCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      const uniqueUnits = Object.values(
        units.reduce((acc, curr) => {
          const unitId = curr.unitId;
          if (!acc[unitId]) {
            acc[unitId] ??= { ...curr, unitName: toSentenceCase(curr.unitName) };
          }
          return acc;
        }, {} as Record<number, { unitName: string; unitId: number }>)
      );
      dispatch(setUnits(uniqueUnits));
    } catch (error) {
      toast.error(error.message || 'Failed to fetch data');
    }
  };

  React.useEffect(() => {
    if (isAuthenticated && employees.length === 0) {
      fetchData();
    }
  }, [isAuthenticated, employees]);

  React.useEffect(() => {
    if (isAuthenticated && status.length === 0) {
      dispatch(fetchStatus());
    }
  }, [isAuthenticated, status]);
  const handleLogout = () => {
    removeSessionItem('token');
    window.location.href = environment.logoutUrl;
  };
  React.useEffect(() => {
    if (applications?.length === 0) {
      dispatch(fetchApplications());
    }
  }, [applications]);

  if (userLoading) {
    return <Loader />;
  }
  return (
    <Sidebar collapsible="icon" {...props} className={state === 'collapsed' ? 'sidebar-collapsed' : ''}>
      <div className="flex justify-end md:pt-[90px] ">
        {state === 'collapsed' ? (
          <ChevronsRight onClick={toggleSidebar} className="w-8 h-8 cursor-pointer" />
        ) : (
          <ChevronsLeft onClick={toggleSidebar} className="w-8 h-8 cursor-pointer" />
        )}
      </div>
      <SidebarSeparator />
      <SidebarContent className="flex justify-between">
        <NavMain items={navMainItems.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {canAccessAdminDashboard && (
            <SidebarMenuButton
              onClick={() => {
                let isUnitHr = userRoles?.find((ele: any) => ele?.roleId === 3);
                const isCorporateHR = isUnitHr?.unitsAssigned?.find((ele: any) => ele?.unitId === 1);
                if (isCorporateHR) {
                  navigate('/corporate-unit-hr-received-requests');
                } else {
                  navigate(roleWiseUrlNavigation[Roles[0]]);
                }
              }}
              asChild
              tooltip={'Manage Organization'}
              className={`transition-all text-black cursor-pointer duration-300  active:bg-primary [&>svg]:size-7 ease-in-out hover:bg-primary hover:text-white h-full w-full active:text-white`}
            >
              <div className={`flex items-center gap-2`}>
                <Hotel size={24} />
                <span>Manage Organization</span>
              </div>
            </SidebarMenuButton>
          )}
          <Separator />

          <SidebarMenuButton
            onClick={handleLogout}
            asChild
            tooltip={'Exit'}
            className={`transition-all cursor-pointer duration-300  active:bg-primary [&>svg]:size-7 ease-in-out hover:bg-primary hover:text-white h-full w-full`}
          >
            <div className={`flex items-center gap-2`}>
              <LogOut size={24} />
              <span>Exit</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
