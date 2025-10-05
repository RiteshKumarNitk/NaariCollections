
"use client";

import Link from "next/link";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { CartSheet } from "./CartSheet";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about-us", label: "About Us" },
];

export function Header() {
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link
                  href="/"
                  className="mr-6 flex items-center space-x-2 p-6"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
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
                          pathname === link.href
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                     <Link
                        href={user ? "/admin" : "/login"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-lg font-medium",
                          pathname === (user ? "/admin" : "/login")
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {user ? 'Admin' : 'Login'}
                      </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
        </div>
        <div className="flex flex-1 items-center justify-start">
            <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
            </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild>
            <Link href={user ? '/admin' : '/login'}>
              <User className="h-5 w-5" />
              <span className="sr-only">{user ? 'Admin' : 'Login'}</span>
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open cart"
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </SheetTrigger>
            <CartSheet />
          </Sheet>
        </div>
      </div>
    </header>
  );
}
