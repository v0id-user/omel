import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const useRouterEvents = (callback: () => void) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    callback();
  }, [pathname, searchParams, callback]);
};
