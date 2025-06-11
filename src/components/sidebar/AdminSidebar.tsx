import * as React from 'react';
import { User, LogOut, BadgeAlert, UserRoundCog, ChevronsRight, ChevronsLeft } from 'lucide-react';
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
  const { isSuperAdmin, isCgm, isDandAR,isGm, isVigilanceAdmin, isCorporateUnitHr, isUnitHr } = useUserRoles();
  const data = {
    navMain: [

      ...(isSuperAdmin
        ? [
          {
            title: 'Manage Admin',
            url: '/admin-manage-role',
            icon: UserRoundCog,
          },
          {
            title: 'Create Form',
            url: '/form',
            icon: BadgeAlert,
          },
        ]
        : []),
      ...(isCgm
        ? [
          {
            title: 'Request Received',
            url: '/cgm-request-received',
            icon: UserRoundCog,
          },
          {
            title: 'Processed Request',
            url: '/cgm-processed-request',
            icon: UserRoundCog,
          },
        ]
        : []),
      ...(isDandAR
        ? [
          {
            title: 'Pending Requests',
            url: '/d-and-ar-pending-requests',
            icon: UserRoundCog,
          },
          {
            title: 'Processed Requests',
            url: '/d-and-ar-processed-requests',
            icon: UserRoundCog,
          },
        ]
        : []),
      ...(isVigilanceAdmin
        ? [
          {
            title: 'Employee mapping',
            url: '/vigilance-admin-role-management',
            icon: UserRoundCog,
          },
          {
            title: 'Manage Grey List',
            url: '/vigilance-admin-manage-grey-list',
            icon: UserRoundCog,
          },
          {
            title: 'Request Received',
            url: '/vigilance-admin-request-received',
            icon: UserRoundCog,
          },
          {
            title: 'Processed Request',
            url: '/vigilance-admin-processed-request',
            icon: UserRoundCog,
          },
        ]
        : []),
      ...(isCorporateUnitHr
        ? [
          {
            title: 'Request Received',
            url: '/corporate-unit-hr-received-requests',
            icon: UserRoundCog,
          },
          {
            title: 'Request Under Process',
            url: '/corporate-unit-hr-request-under-process',
            icon: UserRoundCog,
          },
          {
            title: 'Noc Requests From Vigilance',
            url: '/corporate-unit-hr-noc-requests-from-vigilance',
            icon: UserRoundCog,
          },
          {
            title: 'Noc Requests For Employee',
            url: '/corporate-unit-hr-request-for-employee',
            icon: UserRoundCog,
          },
          {
            title: 'Rejected Requests',
            url: '/corporate-unit-hr-rejected-requests',
            icon: UserRoundCog,
          },
          {
            title: 'Completed Requests',
            url: '/corporate-unit-hr-completed-requests',
            icon: UserRoundCog,
          },
          {
            title: 'Parked Requests',
            url: '/corporate-unit-hr-parked-requests',
            icon: UserRoundCog,
          },
        ]
        : []),
      ...(isUnitHr
        ? [
          {
            title: 'NOC Requests For Employee',
            url: '/unit-hr-request-for-employee',
            icon: UserRoundCog,
          },
          {
            title: 'Pending NOC Requests',
            url: '/unit-hr-pending-noc-requests',
            icon: UserRoundCog,
          },
          {
            title: 'Processed NOC Requests',
            url: '/unit-hr-processed-noc-requests',
            icon: UserRoundCog,
          },
        ]
        : []),
      ...(isGm
        ? [
          {
            title: 'Request Received',
            url: '/gm-request-received',
            icon: UserRoundCog,
          },
          {
            title: 'Processed Requests',
            url: '/gm-processed-requests',
            icon: UserRoundCog,
          },
          {
            title: 'Rejected Requests',
            url: '/gm-rejected-requests',
            icon: UserRoundCog,
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
              <User size={24} />
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
