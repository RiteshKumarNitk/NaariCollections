
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/icons';

const socialLinks = [
  { icon: Instagram, href: '#', name: 'Instagram' },
  { icon: Facebook, href: '#', name: 'Facebook' },
  { icon: Twitter, href: '#', name: 'Twitter' },
];

const footerLinks = [
  { title: 'Shop', links: [{ href: '/shop', label: 'All Products' }, { href: '/shop?category=sarees', label: 'Sarees' }, { href: '/shop?category=suits', label: 'Suits' }, { href: '/shop?category=kurtis', label: 'Kurtis' }] },
  { title: 'About Us', links: [{ href: '/about-us', label: 'Our Story' }, { href: '#', label: 'Contact Us' }, { href: '/gallery', label: 'Gallery' }, { href: '/login', label: 'Admin' }] },
  { title: 'Support', links: [{ href: '/faq', label: 'FAQ' }, { href: '#', label: 'Shipping & Returns' }, { href: '/terms-and-conditions', label: 'Terms & Conditions' }, { href: '#', label: 'Privacy Policy' }] },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container py-12">
        {/* Top Section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + Description */}
          <div className="flex flex-col items-start col-span-full lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Exquisite ethnic wear for the modern woman. Handcrafted with passion, designed for you.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="col-span-full md:col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="font-headline text-sm font-semibold mb-4 text-foreground uppercase tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Naari E-Shop. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
