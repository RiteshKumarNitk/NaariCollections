
"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { SplashScreen } from '@/components/SplashScreen';
import { Toaster } from '@/components/ui/toaster';

export function AppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial delay removed. Loading is now handled by Next.js and component readiness.
    setLoading(false);
  }, [pathname]); // Re-evaluate loading state on path change.

  // Only show splash screen on initial load of the home page.
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (pathname === '/') {
        const timer = setTimeout(() => setIsInitialLoad(false), 800); // Shorter splash for initial visit
        return () => clearTimeout(timer);
    } else {
        setIsInitialLoad(false);
    }
  }, [pathname]);

  // We want to show a splash screen only on the very first load of the marketing site.
  // Subsequent navigations should be instant.
  const isSplashVisible = isInitialLoad && loading && pathname === '/';


  return (
    <>
      {isSplashVisible ? (
        <SplashScreen />
      ) : (
        <AuthProvider>
          <CartProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      )}
    </>
  );
}
