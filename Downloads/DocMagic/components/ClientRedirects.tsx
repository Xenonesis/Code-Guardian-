'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function ClientRedirects() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Example: Redirect `/old` to `/new`
    if (pathname === '/old') {
      router.replace('/new');
    }

    // Example: Protect `/dashboard` if not logged in
    if (pathname.startsWith('/dashboard')) {
      const isLoggedIn = false; // Replace with real auth check (e.g., localStorage, cookies)
      if (!isLoggedIn) {
        router.replace('/login');
      }
    }
  }, [pathname, router]);

  return null; // This component doesn't render anything
}