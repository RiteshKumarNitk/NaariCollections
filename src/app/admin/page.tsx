
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogOut, Image as ImageIcon, Lightbulb, LayoutPanelTop, DollarSign, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null; // or a loading spinner
  }
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="container mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.email}!</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:bg-muted/50 transition-colors">
            <Link href="/admin/products">
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  View, add, edit, and delete products.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-end text-sm font-medium text-primary">
                  Go to Products <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors">
           <Link href="/admin/homepage">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutPanelTop className="h-5 w-5 text-muted-foreground" />
                Homepage Content
              </CardTitle>
              <CardDescription>
                Manage hero slider images and text.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-end text-sm font-medium text-primary">
                Manage Content <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
           </Link>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors">
           <Link href="/admin/about-us">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                About Us Page
              </CardTitle>
              <CardDescription>
                Edit the story and image on your About Us page.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-end text-sm font-medium text-primary">
                Edit Page <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
           </Link>
        </Card>
         <Card className="hover:bg-muted/50 transition-colors">
           <Link href="/admin/bulk-pricing">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                Bulk Price Editor
              </CardTitle>
              <CardDescription>
                Increase all product prices by a set amount.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-end text-sm font-medium text-primary">
                Update Prices <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
           </Link>
        </Card>
        <Card className="bg-muted/30 cursor-not-allowed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-muted-foreground" />
                AI Merchandising
              </CardTitle>
              <CardDescription>
                Get suggestions for bestsellers and product recommendations. (Coming Soon)
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-end text-sm font-medium text-muted-foreground">
                Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
        </Card>
         <Card className="bg-muted/30 cursor-not-allowed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    Gallery Management
                </CardTitle>
              <CardDescription>
                Upload and manage images in your gallery. (Coming Soon)
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-end text-sm font-medium text-muted-foreground">
                Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
