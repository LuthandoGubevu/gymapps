'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { getBackgroundForRoute } from '@/lib/backgrounds';

/**
 * A client component that dynamically sets the background image of the <body>
 * based on the current route. It cleans up after itself when the component unmounts
 * or the path changes.
 */
export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const bgImage = getBackgroundForRoute(pathname);
    
    // Apply styles directly to the body for a seamless, fixed background
    document.body.style.backgroundImage = `url(${bgImage})`;
    document.body.classList.add('bg-cover', 'bg-center', 'bg-fixed');
    
    // Cleanup function to remove styles when the component unmounts or path changes
    return () => {
      document.body.style.backgroundImage = '';
      document.body.classList.remove('bg-cover', 'bg-center', 'bg-fixed');
    };
  }, [pathname]);

  return <>{children}</>;
}
