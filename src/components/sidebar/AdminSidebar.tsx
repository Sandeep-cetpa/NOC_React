import * as React from 'react';
import {
  LogOut,
  ChevronsRight,
  ChevronsLeft,
  Inbox,
  CheckCircle,
  Clock,
  Shield,
  UserCheck,
  AlertTriangle,
  XCircle,
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
import { removeSessionItem } from '@/lib/helperFunction';
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
      const assinedUnit = userRoles?.find((ele) => ele?.roleId === 3)?.unitsAssigned;
      const items = [];

      // Assign appropriate icons for each role type
      let roleIcon = Inbox; // Default icon

      if (roleId === 4) {
        // VigilanceAdmin
        roleIcon = Shield;
        items.push(
          { title: 'Employee Mapping', url: '/vigilance-admin-role-management', icon: UserCheck },
          { title: 'Manage Grey List', url: '/vigilance-admin-manage-grey-list', icon: AlertTriangle },
          { title: 'Request Received', url: '/vigilance-admin-request-received', icon: Inbox },
          { title: 'Processed Request', url: '/vigilance-admin-processed-request', icon: CheckCircle }
        );
      }

      if (roleId === 7) {
        // DandAR
        roleIcon = Clock;
        items.push(
          { title: 'Pending Requests', url: '/d-and-ar-pending-requests', icon: Clock },
          { title: 'Processed Requests', url: '/d-and-ar-processed-requests', icon: CheckCircle }
        );
      }

      if (roleId === 9) {
        // GM
        roleIcon = UserCheck;
        items.push(
          { title: 'Request Received', url: '/gm-request-received', icon: Inbox },
          { title: 'Processed Requests', url: '/gm-processed-requests', icon: CheckCircle },
          { title: 'Rejected Requests', url: '/gm-rejected-requests', icon: XCircle }
        );
      }

      if (roleId === 3 && assinedUnit?.find((ele) => ele?.unitId !== 1)) {
        // Unit HR
        roleIcon = UserCheck;
        items.push(
          { title: 'Create NOC For Employee', url: '/unit-hr-request-for-employee', icon: Inbox },
          { title: 'Unit Pending Requests', url: '/unit-hr-pending-noc-requests', icon: Clock },
          { title: 'Unit Processed Requests', url: '/unit-hr-processed-noc-requests', icon: CheckCircle }
        );
      }
      
      if (roleId === 3 && assinedUnit?.find((ele) => ele?.unitId === 1)) {
        // Corporate HR
        roleIcon = UserCheck;
        items.push(
          { title: 'Pending Requests', url: '/corporate-unit-hr-received-requests', icon: Inbox },
          { title: 'Under Process/Report', url: '/corporate-unit-hr-request-under-process', icon: Clock },
          { title: 'Request From Vigilance', url: '/corporate-unit-hr-noc-requests-from-vigilance', icon: Shield },
          { title: 'Create NOC For Employee', url: '/corporate-unit-hr-request-for-employee', icon: Inbox }
          // { title: 'Rejected Requests', url: '/corporate-unit-hr-rejected-requests', icon: XCircle },
          // { title: 'Completed Requests', url: '/corporate-unit-hr-completed-requests', icon: CheckCircle },
          // { title: 'Parked Request', url: '/corporate-unit-hr-parked-requests', icon: Clock }
        );
      }
      
      if (roleId === 6) {
        // CGM
        roleIcon = UserCheck;
        items.push(
          { title: 'Pending Request', url: '/cgm-request-received', icon: Clock },
          { title: 'Processed Requests', url: '/cgm-processed-request', icon: CheckCircle }
        );
      }
      // Add other roleId-based items similarly

      // Format the role name for display (e.g., "VigilanceAdmin" → "Vigilance Admin")
      const displayTitle = roleId === 3 && assinedUnit?.find((ele) => ele?.unitId === 1) 
        ? 'Corporate Hr' 
        : roleName.replace(/([a-z])([A-Z])/g, '$1 $2');

      return {
        title: displayTitle,
        icon: roleIcon, // Use the role-specific icon
        url: '', // Empty string to indicate this is a parent menu item
        items,
      };
    }).filter(role => role.items.length > 0), // Only include roles with menu items
  };
  const handleLogout = () => {
    removeSessionItem('token');
    dispatch(resetUser());
    window.location.href = environment.logoutUrl;
  };

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
