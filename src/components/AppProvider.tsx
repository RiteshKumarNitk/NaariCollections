
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
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const isSplashVisible = loading && !pathname.startsWith('/admin');

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
