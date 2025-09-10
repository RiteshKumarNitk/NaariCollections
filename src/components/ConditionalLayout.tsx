
"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductsProvider } from '@/hooks/use-products';

export function ConditionalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isLoginPage = pathname === '/login';

    if (isAdminPage) {
        return (
            <ProductsProvider>
                {/* Removed container and mx-auto to allow pages to control their own layout */}
                <main className="py-8">{children}</main>
            </ProductsProvider>
        )
    }

    if (isLoginPage) {
         {/* Removed container and mx-auto to allow pages to control their own layout */}
         return <main className="py-8">{children}</main>
    }

    return (
        <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
