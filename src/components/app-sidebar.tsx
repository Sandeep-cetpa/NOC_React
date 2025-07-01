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
import useUserRoles from '@/hooks/useUserRoles';
import { removeSessionItem } from '@/lib/helperFunction';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployeesData } from '@/features/employee/employeeSlice';
import toast from 'react-hot-toast';
import { setUnits } from '@/features/unit/unitSlice';
import { RootState } from '@/app/store';
import { fetchPurpose } from '@/features/purpose/purposeSlice';
import { fetchStatus } from '@/features/status/statusSlice';
import { fetchApplications } from '@/features/applications/applicationsSlice';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const employees = useSelector((state: RootState) => state.employee.employees);
  const status = useSelector((state: RootState) => state.allStatus.allStatus);
  const purposes = useSelector((state: RootState) => state.pupose.purpose);
  const applications = useSelector((state: RootState) => state.applications.applications);
  const { isUnitHr, roles } = useUserRoles();
  const hasAccess = roles.length > 0;
  // const hasAccess = isNodalOfficer || isSuperAdmin || isAdmin || isUnitCGM;

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
  const dispatch = useDispatch();
  // const isAuthenticated = auth.isAuthenticated;
  const isAuthenticated = true;

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
  //  console.log(purposes,"purposes")
  // React.useEffect(() => {
  //   if (purposes.length === 0) {
  //     dispatch(fetchPurpose());
  //   }
  // }, [purposes]);
  React.useEffect(() => {
    if (applications?.length === 0) {
      dispatch(fetchApplications());
    }
  }, [applications]);
  return (
    <Sidebar collapsible="icon" {...props} className="">
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
          {hasAccess && (
            <SidebarMenuButton
              onClick={() => navigate('/admin-dashboard')}
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
