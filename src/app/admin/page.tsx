
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { products as initialProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If no user is logged in, redirect to the login page.
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  // If there's no user, we can return null or a loading spinner
  // while the redirect happens.
  if (!user) {
      return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="py-8">
       <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products here. Welcome, {user.email}!
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Bestseller
                </TableHead>
                 <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.images[0]}
                      width="64"
                      data-ai-hint="product photo"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ₹{product.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.bestseller ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/edit/${product.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
