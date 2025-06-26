import * as React from 'react';
import {
  User,
  LogOut,
  ChevronsRight,
  ChevronsLeft,
  Users,
  FileText,
  Inbox,
  CheckCircle,
  Clock,
  Shield,
  UserCheck,
  AlertTriangle,
  FileCheck,
  XCircle,
  Archive,
  Eye,
} from 'lucide-react';
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

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { Separator } from '@radix-ui/react-separator';
import { useNavigate } from 'react-router';
import { formatLabel, removeSessionItem } from '@/lib/helperFunction';
import { resetUser } from '@/features/user/userSlice';
import { environment } from '@/config';
import useUserRoles from '@/hooks/useUserRoles';

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>();
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { isSuperAdmin, isCgm, isDandAR, isGm, isVigilanceAdmin, isCorporateUnitHr, isUnitHr } = useUserRoles();

  const userRoles = useSelector((state: RootState) => state.user.Roles);
  function splitCamelCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  const data = {
    navMain: userRoles.map((role) => {
      const { roleName, roleId } = role;

      const items = [];

      if (roleId === 4) {
        // VigilanceAdmin
        items.push(
          { title: 'Employee Mapping', url: '/vigilance-admin-role-management', icon: UserCheck },
          { title: 'Manage Grey List', url: '/vigilance-admin-manage-grey-list', icon: AlertTriangle },
          { title: 'Request Received', url: '/vigilance-admin-request-received', icon: Inbox },
          { title: 'Processed Request', url: '/vigilance-admin-processed-request', icon: Shield }
        );
      }

      if (roleId === 7) {
        // DandAR
        items.push(
          { title: 'Pending Requests', url: '/d-and-ar-pending-requests', icon: Clock },
          { title: 'Processed Requests', url: '/d-and-ar-processed-requests', icon: CheckCircle }
        );
      }

      if (roleId === 9) {
        // GM
        items.push(
          { title: 'Request Received', url: '/gm-request-received', icon: Inbox },
          { title: 'Processed Requests', url: '/gm-processed-requests', icon: CheckCircle },
          { title: 'Rejected Requests', url: '/gm-rejected-requests', icon: XCircle }
        );
      }

      if (roleId === 3) {
        // HrUser
        items.push(
          { title: 'Create NOC For Employee', url: '/unit-hr-request-for-employee', icon: Inbox },
          { title: 'Unit Pending Requests', url: '/unit-hr-pending-noc-requests', icon: Inbox },
          { title: 'Unit Processed Requests ', url: '/unit-hr-processed-noc-requests', icon: Inbox }
        );
      }
      // Add other roleId-based items similarly

      return {
        title: splitCamelCase(roleName), // Converts "VigilanceAdmin" → "Vigilance Admin"
        icon: Inbox, // you can customize this per role
        url: '#',
        items,
      };
    }),
  };
  const handleLogout = () => {
    removeSessionItem('token');
    dispatch(resetUser());
    window.location.href = environment.logoutUrl;
  };

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
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton
            onClick={() => navigate('/create-request')}
            asChild
            tooltip={' Manage Personal View'}
            className={`transition-all text-black cursor-pointer duration-300  active:bg-primary [&>svg]:size-7 ease-in-out hover:bg-primary hover:text-white h-full w-full active:text-white`}
          >
            <div className={`flex items-center gap-2`}>
              <Eye size={24} /> {/* Changed to Eye for "view" */}
              <span> Manage Personal View</span>
            </div>
          </SidebarMenuButton>
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
