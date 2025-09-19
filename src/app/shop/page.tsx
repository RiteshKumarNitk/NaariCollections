
import { Suspense } from 'react';
import { ShopPageClient } from '@/components/ShopPageClient';
import ShopPageSkeleton from './loading';
import { getProducts } from '@/lib/data';

export default async function ShopPage() {
  // We still fetch products here to pass them to the client component
  // The client component will handle the filtering and display logic.
  // This is a trade-off for initial page load vs. client-side interactivity.
  const allProducts = await getProducts();

  return (
    <div className="container mx-auto">
      <Suspense fallback={<ShopPageSkeleton />}>
        <ShopPageClient allProducts={allProducts} />
      </Suspense>
    </div>
  );
}
