import { ChevronRight, type LucideIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useCallback, useState } from 'react';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: any[];
  }[];
}) {
  const { setOpenMobile } = useSidebar();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  }, []);

  const handleChildClick = useCallback(
    (parentIndex: number) => {
      console.log('child clicked, parent index:', parentIndex);
      console.log('current openIndex before child click:', openIndex);
      setOpenIndex(parentIndex);
      setOpenMobile(false);
    },
    [setOpenMobile, openIndex]
  );

  console.log('current openIndex:', openIndex);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items?.map((item, index) => {
          const hasChildren = item?.items && item.items.length > 0;

          // If no children, check if it has a valid URL for navigation
          if (!hasChildren) {
            const isNavigatable = item.url && item.url !== '#' && item.url !== '';
            if (isNavigatable) {
              return (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url} onClick={() => setOpenMobile(false)}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        className={`w-full justify-start px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-white hover:bg-primary/90 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 w-[200px] truncate">
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span className="">{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              );
            } else {
              // Render as non-navigatable item (just text)
              return (
                <SidebarMenuItem key={item.title}>
                  <div className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-500 cursor-default">
                    <div className="flex items-center gap-3 w-[200px] truncate">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.title}</span>
                    </div>
                  </div>
                </SidebarMenuItem>
              );
            }
          }

          // If has children, render as collapsible menu
          return (
            <Collapsible
              key={item.title}
              open={openIndex === index}
              onOpenChange={() => handleToggle(index)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarGroupLabel asChild className="group/label px-0 text-sm font-medium">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-gray-100 hover:text-gray-900 data-[state=open]:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span className="text-gray-700">{item.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
              </SidebarMenuItem>

              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <SidebarGroupContent className="pl-4">
                  <SidebarMenu className="space-y-1">
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <NavLink to={subItem.url} onClick={() => handleChildClick(index)}>
                          {({ isActive }) => (
                            <SidebarMenuButton
                              className={`w-full justify-start px-3 py-2 text-sm transition-colors ${
                                isActive
                                  ? 'bg-primary text-white hover:bg-primary/90 hover:text-white'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              <div className="flex items-center gap-3 w-[200px] truncate">
                                {subItem.icon && <subItem.icon className="w-4 h-4" />}
                                <span>{subItem.title}</span>
                              </div>
                            </SidebarMenuButton>
                          )}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
