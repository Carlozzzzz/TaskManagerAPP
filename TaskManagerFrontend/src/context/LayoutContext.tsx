// src/context/LayoutContext.jsx
import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop toggle
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile toggle

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <LayoutContext.Provider value={{ 
      isCollapsed, 
      isMobileOpen, 
      toggleSidebar, 
      toggleMobile, 
      closeMobile 
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);