
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
  const [isInitialLoad, setIsInitialLoad] = useState(pathname === '/');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isInitialLoad) {
        const timer = setTimeout(() => setIsInitialLoad(false), 800); // Shorter splash for initial visit
        return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  // We only want to show the splash screen on the very first navigation to the home page.
  // Subsequent navigations should be instant. `isClient` ensures we don't try to render this on the server.
  if (isClient && isInitialLoad) {
      return <SplashScreen />;
  }

  return (
    <>
        <AuthProvider>
          <CartProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
          </CartProvider>
        </AuthProvider>
    </>
  );
}
