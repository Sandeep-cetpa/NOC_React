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
export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>();
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const userRoles = useSelector((state: RootState) => state.user.Roles);
  const Roles = userRoles?.map((ele) => ele?.roleName);
  const data = {
    navMain: userRoles?.map((role) => {
      const { roleName, roleId } = role;
      const assinedUnit = userRoles?.find((ele) => ele?.roleId === 3)?.unitsAssigned;
      const items = [];
      // Default role icon
      let roleIcon = Inbox;
      const roleArray = [roleName]; // e.g., ["HrUser"]

      if (roleId === 4) {
        roleIcon = Shield;
        items.push(
          { title: 'Employee Mapping', url: '/vigilance-admin-role-management', icon: UserCheck, role: roleArray },
          {
            title: 'Manage Grey List',
            url: '/vigilance-admin-manage-grey-list',
            icon: AlertTriangle,
            role: roleArray,
          },
          { title: 'Request Received', url: '/vigilance-admin-request-received', icon: Inbox, role: roleArray },
          {
            title: 'Processed Request',
            url: '/vigilance-admin-processed-request',
            icon: CheckCircle,
            role: roleArray,
          }
        );
      }

      if (roleId === 7) {
        roleIcon = Clock;
        items.push(
          { title: 'Pending Requests', url: '/d-and-ar-pending-requests', icon: Clock, role: roleArray },
          { title: 'Create NOC For Employee', url: '/d-and-ar-raise-requests', icon: CheckCircle, role: roleArray }
        );
      }

      if (roleId === 9) {
        roleIcon = UserCheck;
        items.push(
          { title: 'Request Received', url: '/gm-request-received', icon: Inbox, role: roleArray },
          { title: 'Processed Requests', url: '/gm-processed-requests', icon: CheckCircle, role: roleArray },
          { title: 'Rejected Requests', url: '/gm-rejected-requests', icon: XCircle, role: roleArray }
        );
      }

      if (roleId === 3 && assinedUnit?.find((ele) => ele?.unitId !== 1)) {
        roleIcon = UserCheck;
        items.push(
          { title: 'Create NOC For Employee', url: '/unit-hr-request-for-employee', icon: Inbox, role: roleArray },
          { title: 'Unit Pending Requests', url: '/unit-hr-pending-noc-requests', icon: Clock, role: roleArray },
          {
            title: 'Unit Processed Requests',
            url: '/unit-hr-processed-noc-requests',
            icon: CheckCircle,
            role: roleArray,
          }
        );
      }

      if (roleId === 3 && assinedUnit?.find((ele) => ele?.unitId === 1)) {
        roleIcon = UserCheck;
        items.push(
          { title: 'Pending Requests', url: '/corporate-unit-hr-received-requests', icon: Inbox, role: roleArray },
          {
            title: 'Under Process/Report',
            url: '/corporate-unit-hr-request-under-process',
            icon: Clock,
            role: roleArray,
          },
          {
            title: 'Request From Vigilance',
            url: '/corporate-unit-hr-noc-requests-from-vigilance',
            icon: Shield,
            role: roleArray,
          },
          {
            title: 'Create NOC For Employee',
            url: '/corporate-unit-hr-request-for-employee',
            icon: Inbox,
            role: roleArray,
          }
        );
      }

      if (roleId === 6) {
        roleIcon = UserCheck;
        items.push(
          { title: 'Pending Request', url: '/cgm-request-received', icon: Clock, role: roleArray },
          { title: 'Processed Requests', url: '/cgm-processed-request', icon: CheckCircle, role: roleArray }
        );
      }
      if (roleId === 5) {
        roleIcon = UserCheck;
        items.push(
          { title: 'Pending Request', url: '/vigilance-user-request-received', icon: Clock, role: roleArray },
          { title: 'Processed Requests', url: '/vigilance-user-processed-request', icon: CheckCircle, role: roleArray }
        );
      }

      const displayTitle =
        roleId === 3 && assinedUnit?.find((ele) => ele?.unitId === 1)
          ? 'Corporate Hr'
          : roleName.replace(/([a-z])([A-Z])/g, '$1 $2');
      return {
        title: displayTitle,
        icon: roleIcon,
        url: '',
        role: roleArray, // 💡 Add role here
        items,
      };
    }),
  };
  const navMainItems = data?.navMain?.filter((item) => item.role.some((role) => Roles?.includes(role)));
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
        <NavMain items={navMainItems} />
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
