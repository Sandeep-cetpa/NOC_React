import * as React from 'react';
import {
  LayoutGrid,
  LogOut,
  Hotel,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Users,
  ChartNoAxesGantt,
  MonitorCog,
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
import { environment } from '@/config';
import { Separator } from '@radix-ui/react-separator';
import { useNavigate } from 'react-router';
import useUserRoles from '@/hooks/useUserRoles';
import { removeSessionItem } from '@/lib/helperFunction';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const { isNodalOfficer, isSuperAdmin, isAdmin, isUnitCGM } = useUserRoles();
  const hasAccess = isNodalOfficer || isSuperAdmin || isAdmin || isUnitCGM;
  const navMainItems = [
    {
      title: 'Home',
      url: '/home',
      icon: Home,
    },
    {
      title: 'Our Leadership',
      url: '/our-leadership',
      icon: Users,
    },
    {
      title: 'Organization Structure',
      url: '/organization-structure',
      icon: ChartNoAxesGantt,
    },
    {
      title: 'Applications ',
      url: '/applications',
      icon: MonitorCog,
    },
  ].filter(Boolean);

  const handleLogout = () => {
    removeSessionItem('token');
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
      <SidebarContent className="flex justify-between">
        <NavMain items={navMainItems} />
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
