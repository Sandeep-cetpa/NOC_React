import { useEffect } from 'react';
import { useLocation } from 'react-router';

const PreventBackNavigation = () => {
  const location = useLocation();
  useEffect(() => {
    window.history.replaceState(null, '', location.pathname);

    for (let i = 0; i < 3; i++) {
      window.history.pushState(null, '', location.pathname);
    }
    const handlePopState = (e) => {
      window.history.forward();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);
  return null;
};

export default PreventBackNavigation;
