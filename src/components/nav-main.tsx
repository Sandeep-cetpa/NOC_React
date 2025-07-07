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
import { NavLink, useLocation } from 'react-router';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useCallback, useState, useEffect, useRef } from 'react';

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
  const { setOpenMobile, state } = useSidebar();
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if sidebar is collapsed
  const isCollapsed = state === 'collapsed';

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Find which menu should be open based on current URL
  useEffect(() => {
    // Only do this when sidebar is expanded
    if (isCollapsed) return;

    const currentPath = location.pathname;

    // Find the index of the menu that contains the current path
    const menuIndex = items.findIndex((item) => {
      // Check if this is the direct URL
      if (item.url === currentPath) return true;

      // Check if any child item matches the URL
      if (item.items && item.items.length > 0) {
        return item.items.some((subItem) => subItem.url === currentPath);
      }

      return false;
    });

    if (menuIndex !== -1) {
      setOpenIndex(menuIndex);
    }
  }, [location.pathname, items, isCollapsed]);

  // Store the last active menu index in localStorage
  useEffect(() => {
    if (openIndex !== null) {
      localStorage.setItem('lastActiveMenuIndex', openIndex.toString());
    }
  }, [openIndex]);

  // Restore the last active menu index from localStorage
  useEffect(() => {
    if (!isCollapsed && openIndex === null) {
      const lastIndex = localStorage.getItem('lastActiveMenuIndex');
      if (lastIndex !== null) {
        setOpenIndex(parseInt(lastIndex));
      }
    }
  }, [isCollapsed]);

  const handleToggle = useCallback(
    (index: number) => {
      if (isCollapsed) return;
      setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    },
    [isCollapsed]
  );

  const handleChildClick = useCallback(
    (parentIndex: number) => {
      // Keep the parent menu open when clicking on a child
      if (!isCollapsed) {
        setOpenIndex(parentIndex);
        // Store this index in localStorage for persistence
        localStorage.setItem('lastActiveMenuIndex', parentIndex.toString());
      }
      setOpenMobile(false);
      setHoveredIndex(null); // Close any hover dropdowns
    },
    [isCollapsed, setOpenMobile]
  );

  // Render collapsed version (icons only)
  if (isCollapsed) {
    return (
      <SidebarGroup>
        <SidebarMenu>
          {items?.map((item, index) => {
            const hasChildren = item?.items && item.items.length > 0;
            const currentPath = location.pathname;
            const isActive =
              item.url === currentPath || (item.items && item.items.some((subItem) => subItem.url === currentPath));

            // For items with children, show parent icon with dropdown
            if (hasChildren) {
              return (
                <SidebarMenuItem key={`collapsed-${item.title}-${index}`}>
                  <div
                    className="relative group"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Parent Icon Button */}
                    <div
                      className={`flex items-center justify-center w-12 h-10 mx-auto my-1 rounded-md transition-colors cursor-pointer
                        ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => isMobile && setHoveredIndex(hoveredIndex === index ? null : index)}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                    </div>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute left-full top-0 ml-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg 
                        ${
                          hoveredIndex === index || (isMobile && hoveredIndex === index)
                            ? 'opacity-100 visible pointer-events-auto'
                            : 'opacity-0 invisible pointer-events-none md:group-hover:opacity-100 md:group-hover:visible md:group-hover:pointer-events-auto'
                        }`}
                      style={{ minWidth: '220px' }}
                    >
                      {/* Parent Title */}
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                        {item.title}
                      </div>

                      {/* Children Items */}
                      <div className="py-1">
                        {item.items.map((subItem, subIndex) => {
                          const isSubActive = subItem.url === currentPath;

                          return (
                            <NavLink
                              key={`collapsed-sub-${item.title}-${subItem.title}-${subIndex}`}
                              to={subItem.url}
                              onClick={() => {
                                setHoveredIndex(null);
                                setOpenMobile(false);
                              }}
                            >
                              <div
                                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-gray-100 cursor-pointer
                                  ${
                                    isSubActive
                                      ? 'bg-primary text-white hover:bg-primary/90'
                                      : 'text-gray-700 hover:text-gray-900'
                                  }`}
                              >
                                {subItem.icon && <subItem.icon className="w-4 h-4 flex-shrink-0" />}
                                <span className="truncate">{subItem.title}</span>
                              </div>
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </SidebarMenuItem>
              );
            }

            // For items without children
            const isNavigatable = item.url && item.url !== '#' && item.url !== '';
            if (isNavigatable) {
              return (
                <SidebarMenuItem key={`collapsed-simple-${item.title}-${index}`}>
                  <NavLink to={item.url} onClick={() => setOpenMobile(false)}>
                    {({ isActive }) => (
                      <div
                        className={`flex items-center justify-center w-12 h-10 mx-auto my-1 rounded-md transition-colors cursor-pointer group relative
                          ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}

                        {/* Tooltip */}
                        {!isMobile && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            {item.title}
                          </div>
                        )}
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              );
            } else {
              // Non-navigatable item
              return (
                <SidebarMenuItem key={`collapsed-nonav-${item.title}-${index}`}>
                  <div className="flex items-center justify-center w-12 h-10 mx-auto my-1 rounded-md text-gray-400 cursor-default group relative">
                    {item.icon && <item.icon className="w-5 h-5" />}

                    {/* Tooltip */}
                    {!isMobile && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.title}
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              );
            }
          })}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  // Render expanded version
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items?.map((item, index) => {
          const hasChildren = item?.items && item.items.length > 0;
          const currentPath = location.pathname;
          const isActive = item.url === currentPath;
          const hasActiveChild = item.items && item.items.some((subItem) => subItem.url === currentPath);

          // If no children, render as a simple menu item
          if (!hasChildren) {
            const isNavigatable = item.url && item.url !== '#' && item.url !== '';
            if (isNavigatable) {
              return (
                <SidebarMenuItem key={`expanded-${item.title}-${index}`}>
                  <NavLink to={item.url} onClick={() => setOpenMobile(false)}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        className={`w-full justify-start px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-white hover:bg-primary/90 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full truncate">
                          {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                          <span className="truncate">{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              );
            } else {
              // Non-navigatable item
              return (
                <SidebarMenuItem key={`expanded-nonav-${item.title}-${index}`}>
                  <div className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-500 cursor-default">
                    <div className="flex items-center gap-3 w-full truncate">
                      {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                      <span className="truncate">{item.title}</span>
                    </div>
                  </div>
                </SidebarMenuItem>
              );
            }
          }

          // If has children, render as collapsible menu
          return (
            <Collapsible
              key={`expanded-collapsible-${item.title}-${index}`}
              open={openIndex === index || hasActiveChild}
              onOpenChange={() => handleToggle(index)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarGroupLabel asChild className="group/label px-0 text-sm font-medium">
                  <CollapsibleTrigger
                    className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-gray-100 hover:text-gray-900 
                      ${hasActiveChild ? 'bg-gray-50 font-medium' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                      <span className="text-gray-700 truncate">{item.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
              </SidebarMenuItem>

              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <SidebarGroupContent className="pl-4">
                  <SidebarMenu className="space-y-1">
                    {item.items.map((subItem, subIndex) => (
                      <SidebarMenuItem key={`expanded-sub-${item.title}-${subItem.title}-${subIndex}`}>
                        <NavLink to={subItem.url} onClick={() => handleChildClick(index)}>
                          {({ isActive }) => (
                            <SidebarMenuButton
                              className={`w-full justify-start px-3 py-2 text-sm transition-colors ${
                                isActive
                                  ? 'bg-primary text-white hover:bg-primary/90 hover:text-white'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              <div className="flex items-center gap-3 w-full truncate">
                                {subItem.icon && <subItem.icon className="w-4 h-4 flex-shrink-0" />}
                                <span className="truncate">{subItem.title}</span>
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
