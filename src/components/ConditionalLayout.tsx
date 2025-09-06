
"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function ConditionalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin') || pathname === '/login';

    return (
        <>
            {isAdminPage ? (
                <main className="container mx-auto py-8">{children}</main>
            ) : (
                <div className="flex min-h-dvh flex-col">
                    <Header />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                </div>
            )}
        </>
    );
}
