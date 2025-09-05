"use client";

import Link from 'next/link';
import { BaggageClaim, Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';

import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from './CartSheet';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about-us', label: 'About Us' },
];

export function Header() {
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo className="h-8 w-auto" />
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === link.href ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
               <Link href="/" className="mr-6 flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo className="h-8 w-auto" />
               </Link>
               <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                           "text-lg font-medium",
                           pathname === link.href ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                </div>
               </div>
            </SheetContent>
          </Sheet>


          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
             <div className="w-full flex-1 md:w-auto md:flex-none">
                {/* Mobile logo centered */}
                <div className="md:hidden flex-1 flex justify-center">
                    <Link href="/" aria-label="Back to homepage" onClick={() => setIsMobileMenuOpen(false)}>
                        <Logo className="h-8 w-auto" />
                    </Link>
                </div>
             </div>
            <nav className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <CartSheet />
              </Sheet>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
