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
import { useCallback, useState, useEffect } from 'react';

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
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<number | null>(null);
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
  
  const handleToggle = useCallback((index: number) => {
    // Don't allow toggling when collapsed
    if (isCollapsed) return;
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  }, [isCollapsed]);
  
  const handleChildClick = useCallback(
    (parentIndex: number) => {
      if (!isCollapsed) {
        setOpenIndex(parentIndex);
      }
      setOpenMobile(false);
      setMobileDropdownOpen(null); // Close mobile dropdown
    },
    [setOpenMobile, isCollapsed]
  );

  const handleMobileDropdownToggle = useCallback((index: number) => {
    setMobileDropdownOpen(prev => prev === index ? null : index);
  }, []);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileDropdownOpen !== null && !event.target?.closest?.('.mobile-dropdown-container')) {
        setMobileDropdownOpen(null);
      }
    };

    if (isMobile && mobileDropdownOpen !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, mobileDropdownOpen]);

  // Render collapsed version (icons only)
  if (isCollapsed) {
    return (
      <SidebarGroup>
        <SidebarMenu>
          {items?.map((item, index) => {
            const hasChildren = item?.items && item.items.length > 0;

            // For items with children, show parent icon with dropdown
            if (hasChildren) {
              return (
                <SidebarMenuItem key={index}>
                  <div className="mobile-dropdown-container group/dropdown relative">
                    <div 
                      className="flex items-center justify-center w-12 h-10 mx-auto my-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                      title={item.title}
                      onClick={() => isMobile ? handleMobileDropdownToggle(index) : undefined}
                    >
                      {item.icon && <item.icon className="w-5 h-5 text-gray-700" />}
                    </div>
                    
                    {/* Dropdown Menu for Children */}
                    <div className={`absolute left-full top-0 ml-2 z-[60] transition-all duration-200 ${
                      isMobile 
                        ? (mobileDropdownOpen === index ? 'opacity-100 visible' : 'opacity-0 invisible')
                        : 'opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible'
                    }`}>
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] max-w-[250px]">
                        {/* Parent Title */}
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                          {item.title}
                        </div>
                        
                        {/* Children Items */}
                        <div className="py-1">
                          {item.items.map((subItem) => (
                            <NavLink 
                              key={subItem.title}
                              to={subItem.url} 
                              onClick={() => handleChildClick(index)}
                              className="block"
                            >
                              {({ isActive }) => (
                                <div className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-gray-100 cursor-pointer ${
                                  isActive ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700 hover:text-gray-900'
                                }`}>
                                  {subItem.icon && <subItem.icon className="w-4 h-4 flex-shrink-0" />}
                                  <span className="truncate">{subItem.title}</span>
                                </div>
                              )}
                            </NavLink>
                          ))}
                        </div>
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
                <SidebarMenuItem key={index}>
                  <NavLink to={item.url} onClick={() => setOpenMobile(false)}>
                    {({ isActive }) => (
                      <div 
                        className={`flex items-center justify-center w-12 h-10 mx-auto my-1 rounded-md transition-colors cursor-pointer group relative ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        title={item.title}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        
                        {/* Tooltip (only show on desktop when not mobile dropdown) */}
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
                <SidebarMenuItem key={index}>
                  <div 
                    className="flex items-center justify-center w-12 h-10 mx-auto my-1 rounded-md text-gray-400 cursor-default group relative"
                    title={item.title}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    
                    {/* Tooltip (only show on desktop) */}
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

  // Render expanded version (original layout)
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
                <SidebarMenuItem key={index}>
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