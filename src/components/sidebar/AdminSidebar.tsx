import * as React from 'react';
import {
  User,
  LogOut,
  BadgeAlert,
  UserRoundCog,
  ChevronsRight,
  ChevronsLeft,
  // New icons for navigation
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
  UserX,
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

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
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

  const data = {
    navMain: [
      ...(isSuperAdmin
        ? [
            {
              title: 'Manage Admin',
              url: '/admin-manage-role',
              icon: Users, // Better for managing admins
            },
            {
              title: 'Create Form',
              url: '/form',
              icon: FileText, // Better for form creation
            },
          ]
        : []),
      ...(isCgm
        ? [
            {
              title: 'Request Received',
              url: '/cgm-request-received',
              icon: Inbox, // Better for received requests
            },
            {
              title: 'Processed Request',
              url: '/cgm-processed-request',
              icon: CheckCircle, // Better for processed items
            },
          ]
        : []),
      ...(isDandAR
        ? [
            {
              title: 'Pending Requests',
              url: '/d-and-ar-pending-requests',
              icon: Clock, // Better for pending items
            },
            {
              title: 'Processed Requests',
              url: '/d-and-ar-processed-requests',
              icon: CheckCircle, // Better for processed items
            },
          ]
        : []),
      ...(isVigilanceAdmin
        ? [
            {
              title: 'Employee mapping',
              url: '/vigilance-admin-role-management',
              icon: UserCheck, // Better for employee mapping/management
            },
            {
              title: 'Manage Grey List',
              url: '/vigilance-admin-manage-grey-list',
              icon: AlertTriangle, // Better for grey list (warning/caution)
            },
            {
              title: 'Request Received',
              url: '/vigilance-admin-request-received',
              icon: Inbox, // Better for received requests
            },
            {
              title: 'Processed Request',
              url: '/vigilance-admin-processed-request',
              icon: Shield, // Better for vigilance processed items
            },
          ]
        : []),
      ...(isCorporateUnitHr
        ? [
            {
              title: 'Request Received',
              url: '/corporate-unit-hr-received-requests',
              icon: Inbox, // Better for received requests
            },
            {
              title: 'Request Under Process',
              url: '/corporate-unit-hr-request-under-process',
              icon: Clock, // Better for items under process
            },
            {
              title: 'Noc Requests From Vigilance',
              url: '/corporate-unit-hr-noc-requests-from-vigilance',
              icon: Shield, // Better for vigilance-related requests
            },
            {
              title: 'Noc Requests For Employee',
              url: '/corporate-unit-hr-request-for-employee',
              icon: User, // Better for employee-specific requests
            },
            {
              title: 'Rejected Requests',
              url: '/corporate-unit-hr-rejected-requests',
              icon: XCircle, // Better for rejected items
            },
            {
              title: 'Completed Requests',
              url: '/corporate-unit-hr-completed-requests',
              icon: CheckCircle, // Better for completed items
            },
            {
              title: 'Parked Requests',
              url: '/corporate-unit-hr-parked-requests',
              icon: Archive, // Better for parked/stored items
            },
          ]
        : []),
      ...(isUnitHr
        ? [
            {
              title: 'NOC Requests For Employee',
              url: '/unit-hr-request-for-employee',
              icon: User, // Better for employee requests
            },
            {
              title: 'Pending NOC Requests',
              url: '/unit-hr-pending-noc-requests',
              icon: Clock, // Better for pending items
            },
            {
              title: 'Processed NOC Requests',
              url: '/unit-hr-processed-noc-requests',
              icon: FileCheck, // Better for processed NOC requests
            },
          ]
        : []),
      ...(isGm
        ? [
            {
              title: 'Request Received',
              url: '/gm-request-received',
              icon: Inbox, // Better for received requests
            },
            {
              title: 'Processed Requests',
              url: '/gm-processed-requests',
              icon: CheckCircle, // Better for processed items
            },
            {
              title: 'Rejected Requests',
              url: '/gm-rejected-requests',
              icon: XCircle, // Better for rejected items
            },
          ]
        : []),
    ],
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
